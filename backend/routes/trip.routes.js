const express = require('express');
const router = express.Router();
const tripController = require('../controllers/trip.controller');

router.post('/create', tripController.createTrip);
router.get('/my-trips', tripController.getMyTrips);


module.exports = router;
