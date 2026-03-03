import { Request, Response, NextFunction } from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import Booking from '../models/Booking';

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder',
});

// Create Order
export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { amount, bookingId } = req.body;

        const options = {
            amount: amount * 100, // amount in the smallest currency unit (paise)
            currency: "INR",
            receipt: `receipt_booking_${bookingId}`,
        };

        const order = await razorpay.orders.create(options);

        if (bookingId) {
            await Booking.findByIdAndUpdate(bookingId, { razorpayOrderId: order.id });
        }

        res.status(200).json({
            success: true,
            order
        });
    } catch (err) {
        next(err);
    }
};

// Verify Payment
export const verifyPayment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder')
            .update(body.toString())
            .digest("hex");

        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            // Database operations
            await Booking.findOneAndUpdate(
                { razorpayOrderId: razorpay_order_id },
                {
                    razorpayPaymentId: razorpay_payment_id,
                    razorpaySignature: razorpay_signature,
                    paymentStatus: 'paid',
                    status: 'confirmed'
                }
            );

            res.status(200).json({
                success: true,
                message: "Payment verified successfully"
            });
        } else {
            res.status(400).json({
                success: false,
                message: "Invalid signature"
            });
        }
    } catch (err) {
        next(err);
    }
};

// Submit Manual Payment Info
export const submitManualPayment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { bookingId, transactionId } = req.body;

        if (!bookingId || !transactionId) {
            return res.status(400).json({ success: false, message: "Booking ID and Transaction ID are required" });
        }

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ success: false, message: "Booking not found" });
        }

        booking.paymentMethod = 'manual_upi';
        booking.manualPaymentRef = transactionId;
        booking.manualPaymentStatus = 'pending_verification';
        booking.paymentStatus = 'pending';
        // We keep status as pending until admin verifies

        await booking.save();

        res.status(200).json({
            success: true,
            message: "Payment details submitted for verification",
            booking
        });
    } catch (err) {
        next(err);
    }
};
