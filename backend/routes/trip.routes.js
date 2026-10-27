const express = require('express');
const router = express.Router();
const tripController = require('../controllers/trip.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Protected routes — require valid JWT
router.post('/create', authMiddleware, tripController.createTrip);
router.get('/my-trips', authMiddleware, tripController.getMyTrips);

module.exports = router;
