// ============================================
// config/passport.js - Google OAuth Strategy
// ============================================
// HOW GOOGLE OAUTH 2.0 WORKS:
//
// 1. User clicks "Login with Google" on the frontend
// 2. Frontend redirects to /auth/google
// 3. Server redirects user to Google's consent screen
// 4. User grants permission on Google's page
// 5. Google redirects back to /auth/google/callback
//    with an authorization code
// 6. Passport exchanges the code for user profile info
// 7. We find or create the user in our MongoDB database
// 8. User session is created and they're logged in!
//
// serialize: Converts user object → session ID
// deserialize: Converts session ID → user object
// ============================================

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

// Configure the Google OAuth 2.0 strategy
passport.use(new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback',
        proxy: true // Needed if behind a reverse proxy
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            // Check if user already exists in our database
            let user = await User.findOne({ googleId: profile.id });

            if (user) {
                // User exists → log them in
                return done(null, user);
            }

            // User doesn't exist → create new user
            user = await User.create({
                googleId: profile.id,
                displayName: profile.displayName,
                email: profile.emails[0].value,
                avatar: profile.photos[0].value
            });

            done(null, user);
        } catch (error) {
            done(error, null);
        }
    }
));

// Serialize: Store only the user ID in the session
// (keeps the session small and efficient)
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize: Fetch the full user from DB using the stored ID
// (runs on every request to populate req.user)
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});
