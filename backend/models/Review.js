const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  placeId: String,
  destination: String,
  author: { type: String, default: 'Explorer' },
  rating: { type: Number, default: 5 },
  worthIt: { type: Boolean, default: true },
  actualCost: { type: Number, default: 0 },
  timeSpent: String,
  crowdLevel: String,
  comment: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Review', ReviewSchema);
