const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            console.warn("⚠️  MONGO_URI missing. Running without database.");
            return;
        }
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');
    } catch (err) {
        console.error('⚠️  MongoDB Connection Error:', err.message);
        console.error('⚠️  Server running in offline mode (No DB).');
        // process.exit(1); // Prevent crash per user request
    }
};

module.exports = connectDB;
