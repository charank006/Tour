const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  placeId: String,
  worthIt: Boolean,
  actualCost: Number,
  timeSpent: String,
  crowdLevel: String
});

module.exports = mongoose.model('Review', ReviewSchema);
