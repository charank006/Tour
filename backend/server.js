const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const crypto = require('crypto');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.join(__dirname, '.env') });
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const connectDB = require('./config/db');
const cache = require('./utils/cache');
const http = require('./utils/http');
const recommenderService = require('./providers/recommender.service');

const app = express();

// 1. Connect MongoDB gracefully (continues in offline mode if Mongo is unavailable)
connectDB();

// 2. Security Headers
app.use(helmet({
  crossOriginResourcePolicy: false // Allows frontend to load resources smoothly in dev
}));

// 3. CORS Configuration from env (CLIENT_URL)
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:8080,http://localhost:5173,http://127.0.0.1:8080')
  .split(',')
  .map(url => url.trim());

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests (e.g. curl, postman) or matching origins
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    // In dev, permit local connections gracefully
    if (process.env.NODE_ENV !== 'production' && origin.includes('localhost')) {
      return callback(null, true);
    }
    return callback(null, true); // Fallback allow in dev
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token', 'x-request-id'],
  credentials: true
}));

// 4. Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // Limit each IP to 500 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: {
      code: 'TOO_MANY_REQUESTS',
      message: 'Too many requests from this IP. Please try again after a brief pause.'
    }
  }
});
app.use('/api/', limiter);

// 5. Request-ID & Logging Middleware
app.use((req, res, next) => {
  const reqId = req.headers['x-request-id'] || crypto.randomUUID();
  req.id = reqId;
  res.setHeader('x-request-id', reqId);

  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (req.path !== '/api/health') {
      console.log(`[${req.method}] ${req.originalUrl} - ${res.statusCode} (${duration}ms) [reqId: ${reqId.slice(0, 8)}]`);
    }
  });

  next();
});

app.use(express.json());

// 6. Root & Health Check Endpoints
app.get('/', (req, res) => {
  res.send('PlanYours Resilient Travel API is running');
});

app.get('/api/health', (req, res) => {
  const isMongoReady = mongoose.connection && mongoose.connection.readyState === 1;
  const dbStatus = isMongoReady ? 'connected' : 'disconnected (using data/store.json fallback)';

  const healthData = {
    status: isMongoReady ? 'healthy' : 'degraded (operating on local fallback store)',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.round(process.uptime()),
    database: {
      provider: 'MongoDB',
      status: dbStatus,
      stateCode: mongoose.connection.readyState
    },
    cache: cache.stats(),
    recommender: recommenderService.getStatus(),
    circuitBreakers: http.getCircuitStatus()
  };

  res.status(200).json(healthData);
});

// 7. Mount Application Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/trip', require('./routes/trip.routes'));
app.use('/api/places', require('./routes/places.routes'));
app.use('/api/weather', require('./routes/weather.routes'));
app.use('/api/budget', require('./routes/budget.routes'));
app.use('/api/mood', require('./routes/mood.routes'));
app.use('/api/reviews', require('./routes/review.routes'));
app.use('/api/agent', require('./routes/agent.routes'));

// 8. 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    error: {
      code: 'ROUTE_NOT_FOUND',
      message: `Endpoint ${req.method} ${req.originalUrl} not found`
    }
  });
});

// 9. Centralized Error Handler (Never leaks raw stack traces to client)
app.use((err, req, res, next) => {
  console.error(`[Error] [reqId: ${req.id}]:`, err);

  const statusCode = err.status || err.statusCode || 500;
  res.status(statusCode).json({
    error: {
      code: err.code || 'INTERNAL_SERVER_ERROR',
      message: err.message || 'An unexpected internal error occurred. All services remain intact.'
    }
  });
});

const PORT = process.env.PORT || 5001;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`PlanYours Resilient Travel Server listening on port ${PORT}`);
  });
}

module.exports = app;
