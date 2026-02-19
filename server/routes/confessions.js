// ============================================
// routes/confessions.js - Confession API Routes
// ============================================
// CRUD operations for confessions + reactions.
//
// SECRET CODE VERIFICATION FLOW:
// 1. When creating: hash the secret code with bcrypt
// 2. When editing/deleting: user sends plain-text code
// 3. We use bcrypt.compare(plainCode, hashedCode)
// 4. If match → allow operation
// 5. If no match → reject with error message
//
// This ensures secret codes are never stored in
// plain text, even in the database.
// ============================================

const router = require('express').Router();
const bcrypt = require('bcryptjs');
const Confession = require('../models/Confession');
const { ensureAuth } = require('../middleware/auth');

// ============================================
// POST /api/confessions - Create a new confession
// ============================================
// Required body: { text, secretCode }
// User must be logged in (ensureAuth middleware)
router.post('/', ensureAuth, async (req, res) => {
    try {
        const { text, secretCode } = req.body;

        // Validate inputs
        if (!text || !text.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Confession text is required'
            });
        }

        if (!secretCode || secretCode.length < 4) {
            return res.status(400).json({
                success: false,
                message: 'Secret code must be at least 4 characters'
            });
        }

        // Hash the secret code before storing
        // Salt rounds = 10 (good balance of security and speed)
        const salt = await bcrypt.genSalt(10);
        const hashedCode = await bcrypt.hash(secretCode, salt);

        // Create the confession in MongoDB
        const confession = await Confession.create({
            text: text.trim(),
            secretCode: hashedCode,
            userId: req.user.googleId
        });

        // Return the created confession (without the hashed code)
        res.status(201).json({
            success: true,
            message: '✅ Confession posted anonymously!',
            confession: {
                _id: confession._id,
                text: confession.text,
                reactions: confession.reactions,
                createdAt: confession.createdAt
            }
        });
    } catch (error) {
        console.error('Error creating confession:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while creating confession'
        });
    }
});

// ============================================
// GET /api/confessions - Get all confessions
// ============================================
// Returns all confessions sorted by newest first.
// Secret codes are NEVER sent to the client.
router.get('/', async (req, res) => {
    try {
        // Fetch all confessions, exclude secretCode, sort newest first
        const confessions = await Confession.find()
            .select('-secretCode')
            .sort({ createdAt: -1 });

        // If user is logged in, compute their reactions for each confession
        const userId = req.user ? req.user.googleId : null;
        const confessionsWithUserReactions = confessions.map(c => {
            const obj = c.toObject();
            if (userId) {
                obj.userReactions = (obj.reactedBy || [])
                    .filter(r => r.userId === userId)
                    .map(r => r.type);
            } else {
                obj.userReactions = [];
            }
            // Don't send reactedBy array to client (privacy)
            delete obj.reactedBy;
            return obj;
        });

        res.json({
            success: true,
            count: confessionsWithUserReactions.length,
            confessions: confessionsWithUserReactions
        });
    } catch (error) {
        console.error('Error fetching confessions:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching confessions'
        });
    }
});

// ============================================
// PUT /api/confessions/:id - Update a confession
// ============================================
// Required body: { text, secretCode }
// The secret code is verified before allowing update.
router.put('/:id', async (req, res) => {
    try {
        const { text, secretCode } = req.body;

        if (!text || !text.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Updated confession text is required'
            });
        }

        if (!secretCode) {
            return res.status(400).json({
                success: false,
                message: 'Secret code is required to edit'
            });
        }

        // Find the confession by ID
        const confession = await Confession.findById(req.params.id);

        if (!confession) {
            return res.status(404).json({
                success: false,
                message: 'Confession not found'
            });
        }

        // ---- SECRET CODE VERIFICATION ----
        // Compare the provided plain-text code with the stored hash
        const isMatch = await bcrypt.compare(secretCode, confession.secretCode);

        if (!isMatch) {
            return res.status(403).json({
                success: false,
                message: '🔒 Wrong secret code! You cannot edit this confession.'
            });
        }

        // Code matches → update the confession text
        confession.text = text.trim();
        await confession.save();

        res.json({
            success: true,
            message: '✅ Confession updated successfully!',
            confession: {
                _id: confession._id,
                text: confession.text,
                reactions: confession.reactions,
                createdAt: confession.createdAt
            }
        });
    } catch (error) {
        console.error('Error updating confession:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating confession'
        });
    }
});

// ============================================
// DELETE /api/confessions/:id - Delete a confession
// ============================================
// Required body: { secretCode }
// The secret code is verified before allowing deletion.
router.delete('/:id', async (req, res) => {
    try {
        const { secretCode } = req.body;

        if (!secretCode) {
            return res.status(400).json({
                success: false,
                message: 'Secret code is required to delete'
            });
        }

        // Find the confession by ID
        const confession = await Confession.findById(req.params.id);

        if (!confession) {
            return res.status(404).json({
                success: false,
                message: 'Confession not found'
            });
        }

        // ---- SECRET CODE VERIFICATION ----
        const isMatch = await bcrypt.compare(secretCode, confession.secretCode);

        if (!isMatch) {
            return res.status(403).json({
                success: false,
                message: '🔒 Wrong secret code! You cannot delete this confession.'
            });
        }

        // Code matches → delete the confession
        await Confession.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: '🗑️ Confession deleted successfully!'
        });
    } catch (error) {
        console.error('Error deleting confession:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while deleting confession'
        });
    }
});

// ============================================
// POST /api/confessions/:id/react - Toggle a reaction
// ============================================
// Required body: { type } where type is 'like', 'love', or 'laugh'
// User must be logged in to react (to track toggles)
router.post('/:id/react', ensureAuth, async (req, res) => {
    try {
        const { type } = req.body;
        const userId = req.user.googleId;

        // Validate reaction type
        const validReactions = ['like', 'love', 'laugh'];
        if (!type || !validReactions.includes(type)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid reaction type. Must be: like, love, or laugh'
            });
        }

        // Find the confession
        const confession = await Confession.findById(req.params.id);

        if (!confession) {
            return res.status(404).json({
                success: false,
                message: 'Confession not found'
            });
        }

        // Check if user already reacted with this type
        const existingIndex = confession.reactedBy.findIndex(
            r => r.userId === userId && r.type === type
        );

        if (existingIndex !== -1) {
            // User already reacted → remove reaction (toggle off)
            confession.reactedBy.splice(existingIndex, 1);
            confession.reactions[type] = Math.max(0, confession.reactions[type] - 1);
        } else {
            // User hasn't reacted → add reaction (toggle on)
            confession.reactedBy.push({ userId, type });
            confession.reactions[type] += 1;
        }

        await confession.save();

        // Return which reaction types this user has active
        const userReactions = confession.reactedBy
            .filter(r => r.userId === userId)
            .map(r => r.type);

        res.json({
            success: true,
            reactions: confession.reactions,
            userReactions
        });
    } catch (error) {
        console.error('Error toggling reaction:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while toggling reaction'
        });
    }
});

module.exports = router;
