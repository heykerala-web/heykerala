import express from 'express';
import { createOrder, verifyPayment, submitManualPayment } from '../controllers/paymentController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/order', protect, createOrder);
router.post('/verify', protect, verifyPayment);
router.post('/manual-submit', protect, submitManualPayment);

export default router;
