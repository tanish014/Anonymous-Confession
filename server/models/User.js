// ============================================
// models/User.js - User Schema
// ============================================
// Stores Google OAuth user profiles.
// When a user logs in with Google for the first
// time, we create a record here. On subsequent
// logins, we look them up by googleId.
// ============================================

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    // Unique ID from Google (used to identify returning users)
    googleId: {
        type: String,
        required: true,
        unique: true
    },
    // User's display name from Google profile
    displayName: {
        type: String,
        required: true
    },
    // User's email from Google profile
    email: {
        type: String,
        required: true
    },
    // User's profile picture URL from Google
    avatar: {
        type: String
    },
    // When the user first logged in
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', UserSchema);
