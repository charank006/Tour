const express = require('express');
const router = express.Router();
const moodController = require('../controllers/mood.controller');
const auth = require('../middleware/auth.middleware');

router.post('/analyze', auth, moodController.analyzeMood);

module.exports = router;
