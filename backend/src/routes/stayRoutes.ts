import express from 'express';
import {
    addStay,
    submitStay,
    getStays,
    getStayById,
    updateStay,
    deleteStay
} from '../controllers/stayController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', getStays);
router.get('/:id', getStayById);

// Protected
router.post('/user/submission', protect, submitStay);

// Admin only routes
router.post('/', protect, authorize('Admin'), addStay);
router.put('/:id', protect, authorize('Admin'), updateStay);
router.delete('/:id', protect, authorize('Admin'), deleteStay);

export default router;
