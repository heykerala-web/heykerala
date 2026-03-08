import express from 'express';
import { createOrder, verifyPayment, submitManualPayment, verifyDemoPayment } from '../controllers/paymentController';
import { createPayPalOrder, capturePayPalPayment, verifyPayPalDemoPayment } from '../controllers/payPalController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/order', protect, createOrder);
router.post('/verify', protect, verifyPayment);
router.post('/manual-submit', protect, submitManualPayment);
router.post('/demo-verify', protect, verifyDemoPayment);

// PayPal Routes
router.post('/paypal/create-order', protect, createPayPalOrder);
router.post('/paypal/capture-payment', protect, capturePayPalPayment);
router.post('/paypal/demo-verify', protect, verifyPayPalDemoPayment);

export default router;
