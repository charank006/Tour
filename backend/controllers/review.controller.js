const mongoose = require('mongoose');
const Review = require('../models/Review');
const fileStore = require('../utils/store');

const isMongoConnected = () => mongoose.connection && mongoose.connection.readyState === 1;

exports.createReview = async (req, res) => {
  try {
    const { placeId, destination, author, rating, worthIt, actualCost, timeSpent, crowdLevel, comment } = req.body;

    const reviewData = {
      placeId: placeId || 'general',
      destination: destination || 'General',
      author: author || 'Anonymous Traveler',
      rating: Number(rating) || 5,
      worthIt: worthIt !== undefined ? Boolean(worthIt) : true,
      actualCost: Number(actualCost) || 0,
      timeSpent: timeSpent || '2-3 hours',
      crowdLevel: crowdLevel || 'Moderate',
      comment: comment || '',
      createdAt: new Date().toISOString()
    };

    let saved = null;
    if (isMongoConnected()) {
      try {
        const doc = new Review(reviewData);
        saved = await doc.save();
      } catch (err) {
        console.warn('[ReviewController] Mongo save failed, using fileStore:', err.message);
      }
    }

    if (!saved) {
      saved = fileStore.saveReview(reviewData);
    }

    return res.status(201).json({ success: true, review: saved });
  } catch (err) {
    console.error('[ReviewController] createReview error:', err);
    const fallback = fileStore.saveReview(req.body);
    return res.status(201).json({ success: true, review: fallback });
  }
};

exports.getReviews = async (req, res) => {
  try {
    const { placeId, destination } = req.query;

    if (isMongoConnected()) {
      try {
        const query = {};
        if (placeId) query.placeId = placeId;
        if (destination) query.destination = new RegExp(destination, 'i');
        const reviews = await Review.find(query).sort({ createdAt: -1 }).limit(50);
        if (reviews && reviews.length > 0) {
          return res.json(reviews);
        }
      } catch (err) {
        console.warn('[ReviewController] Mongo find failed, using fileStore:', err.message);
      }
    }

    const fileReviews = fileStore.getAllReviews(placeId);
    return res.json(fileReviews);
  } catch (err) {
    console.error('[ReviewController] getReviews error:', err);
    return res.json(fileStore.getAllReviews());
  }
};
