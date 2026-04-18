// ============================================
// routes/auth.js - Authentication Routes
// ============================================
// These routes handle the Google OAuth 2.0 flow:
//
// 1. GET /auth/google
//    → Redirects user to Google's login/consent page
//
// 2. GET /auth/google/callback
//    → Google redirects here after user grants permission
//    → Passport exchanges the code for user info
//    → User is logged in and redirected to frontend
//
// 3. GET /auth/logout
//    → Destroys the session and logs out the user
//
// 4. GET /auth/current_user
//    → Returns the currently logged-in user's info
//    → Frontend uses this to check login status
// ============================================

const router = require('express').Router();
const passport = require('passport');

// ---- Step 1: Redirect to Google ----
// When user clicks "Login with Google", they hit this route.
// Passport redirects them to Google's consent screen.
// 'scope' tells Google what info we want (profile + email).
router.get('/google',
    passport.authenticate('google', {
        scope: ['profile', 'email']
    })
);

// ---- Step 2: Google Callback ----
// After user grants permission, Google redirects here.
// Passport handles the code exchange and creates a session.
// On success: redirect to frontend homepage
// On failure: redirect to frontend login page
router.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: process.env.NODE_ENV === 'production' ? '/login' : `${process.env.CLIENT_URL || 'http://localhost:5173'}/login`
    }),
    (req, res) => {
        // Successful login → redirect to React app
        const redirectUrl = process.env.NODE_ENV === 'production' ? '/' : (process.env.CLIENT_URL || 'http://localhost:5173');
        res.redirect(redirectUrl);
    }
);

// ---- Step 3: Logout ----
// Destroys the user's session and clears the cookie
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ message: 'Error logging out' });
        }
        req.session.destroy(() => {
            const redirectUrl = process.env.NODE_ENV === 'production' ? '/' : (process.env.CLIENT_URL || 'http://localhost:5173');
            res.redirect(redirectUrl);
        });
    });
});

// ---- Step 4: Get Current User ----
// Returns the logged-in user's info, or null if not logged in.
// The React frontend calls this on page load to check auth status.
router.get('/current_user', (req, res) => {
    if (req.user) {
        res.json({
            success: true,
            user: {
                id: req.user._id,
                googleId: req.user.googleId,
                displayName: req.user.displayName,
                email: req.user.email,
                avatar: req.user.avatar
            }
        });
    } else {
        res.json({ success: false, user: null });
    }
});

module.exports = router;
