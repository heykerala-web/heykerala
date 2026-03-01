import express from 'express';
import {
    addEvent,
    submitEvent,
    getEvents,
    getCalendarEvents,
    getTrendingEvents,
    getFeaturedEvents,
    getEventById,
    updateEvent,
    deleteEvent,
    toggleFeatured,
    bulkUploadEvents,
    autoExpireEvents,
    getAIEventRecommendations
} from '../controllers/eventController';
import {
    setReminder,
    removeReminder,
    getUserReminders
} from '../controllers/eventReminderController';
import { protect, authorize, requireContributor } from '../middleware/authMiddleware';

const router = express.Router();

// ── Public Routes ─────────────────────────────────────────────
router.get('/calendar', getCalendarEvents);
router.get('/trending', getTrendingEvents);
router.get('/featured', getFeaturedEvents);
router.get('/', getEvents);
router.get('/:id', getEventById);

// ── Protected Routes ──────────────────────────────────────────
router.get('/user/my-reminders', protect, getUserReminders);
router.get('/user/ai-recommendations', protect, getAIEventRecommendations);
router.post('/user/submission', protect, requireContributor, submitEvent);
router.post('/:id/remind', protect, setReminder);
router.delete('/:id/remind', protect, removeReminder);

// ── Admin Routes ──────────────────────────────────────────────
router.post('/', protect, authorize('Admin'), addEvent);
router.put('/:id', protect, authorize('Admin'), updateEvent);
router.delete('/:id', protect, authorize('Admin'), deleteEvent);
router.put('/:id/featured', protect, authorize('Admin'), toggleFeatured);
router.post('/admin/bulk-upload', protect, authorize('Admin'), bulkUploadEvents);
router.post('/admin/auto-expire', protect, authorize('Admin'), autoExpireEvents);

export default router;
