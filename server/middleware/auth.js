// ============================================
// middleware/auth.js - Authentication Middleware
// ============================================
// This middleware checks if a user is logged in
// before allowing access to protected routes.
//
// How it works:
// - Passport.js adds req.isAuthenticated() method
// - If the user has a valid session, it returns true
// - If not, we send a 401 Unauthorized response
// ============================================

const ensureAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        // User is logged in → allow the request to proceed
        return next();
    }
    // User is NOT logged in → block access
    res.status(401).json({
        success: false,
        message: '❌ Please log in with Google to access this feature'
    });
};

module.exports = { ensureAuth };
