const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware - Strict CORS for Frontend
app.use(cors({
    origin: 'http://localhost:8080',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());

// Routes Placeholder
app.get('/', (req, res) => {
    res.send('PlanYours Backend API is running (No DB Mode)');
});

// Import Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/trip', require('./routes/trip.routes'));
app.use('/api/places', require('./routes/places.routes'));
app.use('/api/weather', require('./routes/weather.routes'));
app.use('/api/budget', require('./routes/budget.routes'));
app.use('/api/mood', require('./routes/mood.routes'));

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
