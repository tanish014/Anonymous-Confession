// ============================================
// server.js - Main Entry Point
// ============================================
// This is the heart of our backend server.
// It sets up Express, connects to MongoDB,
// configures Google OAuth via Passport.js,
// and mounts all API routes.
// ============================================

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const cors = require('cors');
require('dotenv').config();

// Load Passport Google OAuth strategy configuration
require('./config/passport');

const app = express();

// ============================================
// Middleware Setup
// ============================================

// Parse incoming JSON request bodies
app.use(express.json());

// Enable CORS so our React frontend can talk to this server
// credentials: true allows cookies (sessions) to be sent cross-origin
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// ============================================
// Session Configuration
// ============================================
// Sessions keep users logged in between requests.
// We store sessions in MongoDB so they persist
// even if the server restarts.
app.use(session({
    secret: process.env.SESSION_SECRET || 'fallback-secret-key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI || 'mongodb://localhost:27017/confession-wall',
        collectionName: 'sessions'
    }),
    cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        httpOnly: true,
        secure: false, // Set to true in production with HTTPS
        sameSite: 'lax'
    }
}));

// ============================================
// Passport Initialization
// ============================================
// Initialize Passport and restore authentication
// state from the session (if a user is already logged in)
app.use(passport.initialize());
app.use(passport.session());

// ============================================
// Routes
// ============================================

// Auth routes: Google login, callback, logout, current user
app.use('/auth', require('./routes/auth'));

// Confession API routes: CRUD operations + reactions
app.use('/api/confessions', require('./routes/confessions'));

// Simple health check endpoint
app.get('/', (req, res) => {
    res.json({ message: '🌌 Confession Wall API is running!' });
});

// ============================================
// Database Connection & Server Start
// ============================================
const PORT = process.env.PORT || 5000;

// Connect to MongoDB first, then start the server
require('./config/db')().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
        console.log(`🌐 Client URL: ${process.env.CLIENT_URL || 'http://localhost:5173'}`);
    });
});
