const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  preferences: {
    mood: String,
    pace: String,
    moneyMood: String
  }
});

module.exports = mongoose.model('User', UserSchema);
