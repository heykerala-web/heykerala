import { Request, Response, NextFunction } from 'express';
import Booking from '../models/Booking';
import User from '../models/User';
import Stay from '../models/Stay';
import { sendBookingConfirmationEmail } from '../services/emailService';

// PayPal Sandbox API Base URL
const PAYPAL_API = process.env.PAYPAL_MODE === 'sandbox'
    ? 'https://api-m.sandbox.paypal.com'
    : 'https://api-m.paypal.com';

const CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;

// Get Access Token from PayPal
const getPayPalAccessToken = async () => {
    const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
    const response = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
        method: 'POST',
        body: 'grant_type=client_credentials',
        headers: {
            Authorization: `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });

    const data = await response.json();
    return data.access_token;
};

// Create PayPal Order
export const createPayPalOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { bookingId } = req.body;
        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        const accessToken = await getPayPalAccessToken();
        const response = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                intent: 'CAPTURE',
                purchase_units: [
                    {
                        amount: {
                            currency_code: 'INR',
                            value: booking.totalPrice.toString(),
                        },
                        description: `Booking for stay ${booking.stayId}`,
                        reference_id: booking._id.toString(),
                    },
                ],
            }),
        });

        const order = await response.json();

        if (order.id) {
            await Booking.findByIdAndUpdate(bookingId, { paypalOrderId: order.id });
        }

        res.status(200).json({
            success: true,
            orderId: order.id,
        });
    } catch (err) {
        next(err);
    }
};

// Capture PayPal Payment
export const capturePayPalPayment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { orderId, bookingId } = req.body;

        const accessToken = await getPayPalAccessToken();
        const response = await fetch(`${PAYPAL_API}/v2/checkout/orders/${orderId}/capture`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const captureData = await response.json();

        if (captureData.status === 'COMPLETED') {
            const paypalPaymentId = captureData.purchase_units[0].payments.captures[0].id;

            const updatedBooking = await Booking.findByIdAndUpdate(
                bookingId,
                {
                    paypalPaymentId,
                    paymentStatus: 'paid',
                    status: 'confirmed',
                    paymentMethod: 'paypal'
                },
                { new: true }
            );

            if (updatedBooking) {
                const user = await User.findById(updatedBooking.userId);
                const stay = await Stay.findById(updatedBooking.stayId);
                if (user && user.email) {
                    await sendBookingConfirmationEmail(user.email, user.name || 'Valued Guest', {
                        id: updatedBooking._id,
                        stayName: stay?.name || 'Your Stay',
                        checkIn: updatedBooking.checkIn,
                        checkOut: updatedBooking.checkOut,
                        totalPrice: updatedBooking.totalPrice
                    });
                }
            }

            res.status(200).json({
                success: true,
                message: 'Payment captured successfully',
                booking: updatedBooking
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Payment capture failed',
                details: captureData
            });
        }
    } catch (err) {
        next(err);
    }
};
// Verify PayPal Demo Payment (Bypass for college project demo)
export const verifyPayPalDemoPayment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { bookingId } = req.body;

        if (!bookingId) {
            return res.status(400).json({ success: false, message: "Booking ID is required" });
        }

        const updatedBooking = await Booking.findByIdAndUpdate(
            bookingId,
            {
                paypalPaymentId: `PAYID-DEMO-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
                paymentStatus: 'paid',
                status: 'confirmed',
                paymentMethod: 'paypal'
            },
            { new: true }
        );

        if (updatedBooking) {
            // Send Email (optional for demo)
            const user = await User.findById(updatedBooking.userId);
            const stay = await Stay.findById(updatedBooking.stayId);
            if (user && user.email) {
                try {
                    await sendBookingConfirmationEmail(user.email, user.name || 'Valued Guest', {
                        id: updatedBooking.bookingId || updatedBooking._id,
                        stayName: stay?.name || 'Your Stay',
                        checkIn: updatedBooking.checkIn,
                        checkOut: updatedBooking.checkOut,
                        totalPrice: updatedBooking.totalPrice
                    });
                } catch (emailErr) {
                    console.error("Email simulation failed (non-critical):", emailErr);
                }
            }

            return res.status(200).json({
                success: true,
                message: "PayPal Demo Payment verified successfully",
                booking: updatedBooking
            });
        } else {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }
    } catch (err) {
        next(err);
    }
};
