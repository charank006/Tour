const mongoose = require('mongoose');

const TripSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    destination: String,
    startLocation: String,
    startDate: String,
    endDate: String,
    travelers: String,
    mood: String,
    pace: String,
    budget: Number,
    plan: Object
});

module.exports = mongoose.model('Trip', TripSchema);
