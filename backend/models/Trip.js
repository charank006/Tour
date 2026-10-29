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
    plan: Object,
    shareId: { type: String, unique: true, sparse: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Trip', TripSchema);
