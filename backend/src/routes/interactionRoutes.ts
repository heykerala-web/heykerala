import express from 'express';
import { trackInteraction, getUserPreferences } from '../controllers/interactionController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

/**
 * POST /api/interactions/track
 * Records a user interaction event (view, bookmark, category_click, etc.)
 * Public route – uses sessionId from body for guest tracking.
 * If user is logged in and sends a token, userId is automatically attached.
 */
router.post('/track', (req, res, next) => {
    // Soft-protect: attach user if token exists, but don't block guests
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
        return protect(req, res, next);
    }
    next();
}, trackInteraction);

/**
 * GET /api/interactions/preferences
 * Returns the aggregated user preference profile from recent interactions.
 * Accepts sessionId as query param for guests, or uses auth token for logged-in users.
 */
router.get('/preferences', (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
        return protect(req, res, next);
    }
    next();
}, getUserPreferences);

export default router;
