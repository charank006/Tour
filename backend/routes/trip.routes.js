const express = require('express');
const router = express.Router();
const tripController = require('../controllers/trip.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { z } = require('zod');

// Validation helper
const validateBody = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (err) {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: err.errors?.[0]?.message || 'Invalid payload',
        details: err.errors
      }
    });
  }
};

const createTripSchema = z.object({
  destination: z.string().min(1, 'Destination is required'),
  startLocation: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  travelers: z.union([z.number(), z.string()]).optional(),
  mood: z.string().optional(),
  pace: z.string().optional(),
  budget: z.union([z.number(), z.string()]).optional()
});

// Trip Generation & CRUD
router.post('/create', authMiddleware, validateBody(createTripSchema), tripController.createTrip);
router.post('/save', authMiddleware, tripController.saveTrip);
router.get('/my-trips', authMiddleware, tripController.getMyTrips);
router.get('/share/:id', tripController.getTripById);
router.get('/:id', tripController.getTripById);
router.delete('/:id', authMiddleware, tripController.deleteTrip);

module.exports = router;
