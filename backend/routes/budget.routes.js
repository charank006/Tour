const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/budget.controller');
const auth = require('../middleware/auth.middleware');

router.post('/split', auth, budgetController.splitBudget);

module.exports = router;
