const mongoose = require('mongoose');

// Model: LocalTip
// Stores crowd-sourced or curated local advice

const LocalTipSchema = new mongoose.Schema({
    city: String,
    text: String,
    author: String,
    category: { type: String, enum: ['Food', 'Safety', 'Culture', 'Savings'] },
    trustScore: Number
});

module.exports = mongoose.model('LocalTip', LocalTipSchema);
