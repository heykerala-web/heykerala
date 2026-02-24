import express from 'express';
import {
    addEvent,
    submitEvent,
    getEvents,
    getEventById,
    updateEvent,
    deleteEvent
} from '../controllers/eventController';
import { protect, authorize, requireContributor } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/user/submission', protect, requireContributor, submitEvent);
router.post('/', protect, authorize('Admin'), addEvent);
router.get('/', getEvents);
router.get('/:id', getEventById);
router.put('/:id', protect, authorize('Admin'), updateEvent);
router.delete('/:id', protect, authorize('Admin'), deleteEvent);

export default router;
