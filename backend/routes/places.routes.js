const express = require('express');
const router = express.Router();
const placesController = require('../controllers/places.controller');
const auth = require('../middleware/auth.middleware');

// Public or Protected routes? "Context-Aware" suggests personalization.
// Let's protect them to ensure we know "who" is asking if needed, or keep public for general queries.
// User requirement: "Middleware to protect routes".
router.get('/search', auth, placesController.searchPlaces);

module.exports = router;
