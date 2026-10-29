const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review.controller');
const { z } = require('zod');

// Zod validation middleware helper
const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (err) {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: err.errors?.[0]?.message || 'Invalid request body',
        details: err.errors
      }
    });
  }
};

const createReviewSchema = z.object({
  placeId: z.string().optional(),
  destination: z.string().optional(),
  author: z.string().min(1, 'Author name is required').max(100),
  rating: z.number().min(1).max(5).optional(),
  worthIt: z.boolean().optional(),
  actualCost: z.number().nonnegative().optional(),
  timeSpent: z.string().optional(),
  crowdLevel: z.string().optional(),
  comment: z.string().min(3, 'Review comment must be at least 3 characters')
});

router.post('/', validate(createReviewSchema), reviewController.createReview);
router.get('/', reviewController.getReviews);

module.exports = router;
