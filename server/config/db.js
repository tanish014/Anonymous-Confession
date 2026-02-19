// ============================================
// config/db.js - MongoDB Connection
// ============================================
// This file handles connecting to MongoDB.
// It uses Mongoose to establish the connection.
// ============================================

const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(
            process.env.MONGO_URI || 'mongodb://localhost:27017/confession-wall'
        );
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        process.exit(1); // Exit if DB connection fails
    }
};

module.exports = connectDB;
