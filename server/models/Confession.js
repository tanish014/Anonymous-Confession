// ============================================
// models/Confession.js - Confession Schema
// ============================================
// Each confession stores:
// - The confession text
// - A hashed secret code (for edit/delete auth)
// - Reaction counts (like, love, laugh)
// - The Google user ID who posted it
// - Creation timestamp
//
// SECRET CODE VERIFICATION:
// The secret code is hashed with bcrypt before
// storing. When a user wants to edit or delete,
// they provide the plain-text code, and we use
// bcrypt.compare() to check if it matches the
// stored hash. This way, even if someone accesses
// the database, they can't see the actual codes.
// ============================================

const mongoose = require('mongoose');

const ConfessionSchema = new mongoose.Schema({
    // The confession text content
    text: {
        type: String,
        required: [true, 'Confession text is required'],
        trim: true,
        maxlength: [1000, 'Confession cannot exceed 1000 characters']
    },
    // Hashed secret code (using bcrypt)
    // This is NOT stored in plain text for security
    secretCode: {
        type: String,
        required: [true, 'Secret code is required']
    },
    // Reaction counters
    reactions: {
        like: { type: Number, default: 0 },   // ❤️
        love: { type: Number, default: 0 },   // 💖
        laugh: { type: Number, default: 0 }   // 😂
    },
    // Track which users reacted (for toggle support)
    reactedBy: [{
        userId: String,
        type: { type: String, enum: ['like', 'love', 'laugh'] }
    }],
    // Google account ID of the user who posted
    // (stored for reference, but confessions are displayed anonymously)
    userId: {
        type: String,
        required: true
    },
    // When the confession was posted
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Confession', ConfessionSchema);
