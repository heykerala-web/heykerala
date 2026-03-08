import { Request, Response } from "express";
import User from "../models/User";
import Place from "../models/Place";
import Review from "../models/Review";
import Stay from "../models/Stay";
import Event from "../models/Event";
import { getModelByType, updateTargetRating } from "../utils/reviewUtils";

// Get Admin Stats
export const getStats = async (req: Request, res: Response) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalPlaces = await Place.countDocuments();
        const totalReviews = await Review.countDocuments();
        const totalStays = await Stay.countDocuments();
        const totalEvents = await Event.countDocuments();
        const pendingPlaces = await Place.countDocuments({ status: "pending" });
        const pendingStays = await Stay.countDocuments({ status: "pending" });
        const pendingEvents = await Event.countDocuments({ status: "pending" });
        const totalPending = pendingPlaces + pendingStays + pendingEvents;

        res.json({
            success: true,
            stats: {
                totalUsers,
                totalPlaces,
                totalReviews,
                totalStays,
                totalEvents,
                totalPending
            }
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Activity Logs
import ActivityLog from "../models/ActivityLog";

export const getActivityLogs = async (req: Request, res: Response) => {
    try {
        const logs = await ActivityLog.find()
            .populate("user", "name email role")
            .sort({ createdAt: -1 })
            .limit(50);

        res.json({ success: true, logs });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// --- USER MANAGEMENT ---

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find().select("-password").sort({ createdAt: -1 });
        res.json({ success: true, users });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const updateUserRole = async (req: Request, res: Response) => {
    try {
        const { role } = req.body;
        const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
        res.json({ success: true, user });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "User deleted" });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// --- SUBMISSION MANAGEMENT (PLACES, STAYS, EVENTS) ---

export const getPendingSubmissions = async (req: Request, res: Response) => {
    try {
        const { status } = req.query;
        const query = status ? { status } : { status: "pending" };

        const places = await Place.find(query).populate("createdBy", "name email");
        const stays = await Stay.find(query).populate("createdBy", "name email");
        const events = await Event.find(query).populate("createdBy", "name email");

        // Normalize data for frontend
        const submissions = [
            ...places.map(p => ({ ...p.toObject(), type: "Place" })),
            ...stays.map(s => ({ ...s.toObject(), type: "Stay" })),
            ...events.map(e => ({ ...e.toObject(), type: "Event" }))
        ];

        // Sort by createdAt desc
        submissions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        res.json({ success: true, submissions });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Approve Submission
export const approveSubmission = async (req: Request, res: Response) => {
    try {
        const { id, type } = req.params;
        let Model;

        if (type === 'Place') Model = Place;
        else if (type === 'Stay') Model = Stay;
        else if (type === 'Event') Model = Event;
        else return res.status(400).json({ message: "Invalid type" });

        const item = await Model.findByIdAndUpdate(id, { status: "approved" }, { new: true });

        if (!item) return res.status(404).json({ message: "Item not found" });

        res.json({ success: true, message: "Approved successfully", data: item });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Reject Submission
export const rejectSubmission = async (req: Request, res: Response) => {
    try {
        const { id, type } = req.params;
        let Model;

        if (type === 'Place') Model = Place;
        else if (type === 'Stay') Model = Stay;
        else if (type === 'Event') Model = Event;
        else return res.status(400).json({ message: "Invalid type" });

        const item = await Model.findByIdAndUpdate(id, { status: "rejected" }, { new: true });

        if (!item) return res.status(404).json({ message: "Item not found" });

        res.json({ success: true, message: "Rejected successfully", data: item });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Delete Submission
export const deleteSubmission = async (req: Request, res: Response) => {
    try {
        const { id, type } = req.params;
        let Model;

        if (type === 'Place') Model = Place;
        else if (type === 'Stay') Model = Stay;
        else if (type === 'Event') Model = Event;
        else return res.status(400).json({ message: "Invalid type" });

        await Model.findByIdAndDelete(id);

        // Cascading delete reviews
        await Review.deleteMany({ targetId: id, targetType: type.toLowerCase() });

        res.json({ success: true, message: "Deleted successfully" });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};


// --- EXISTING PLACE MANAGEMENT (Keeping for backward compat if used) ---

export const getAllPlaces = async (req: Request, res: Response) => {
    try {
        const places = await Place.find().sort({ createdAt: -1 });
        res.json({ success: true, places });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const deletePlace = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await Place.findByIdAndDelete(id);

        // Cascading delete reviews
        await Review.deleteMany({ targetId: id, targetType: "place" });

        res.json({ success: true, message: "Place deleted" });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// --- REVIEW MANAGEMENT ---

export const getAllReviews = async (req: Request, res: Response) => {
    try {
        const reviews = await Review.find().populate("user", "name email").sort({ createdAt: -1 });

        // Manually populate target data for universal reviews
        const populatedReviews = await Promise.all(reviews.map(async (review) => {
            const TargetModel = getModelByType(review.targetType);
            const targetData = TargetModel ? await TargetModel.findById(review.targetId).select("name title") : null;

            return {
                ...review.toObject(),
                target: targetData ? {
                    _id: targetData._id,
                    name: (targetData as any).name || (targetData as any).title,
                    type: review.targetType
                } : null
            };
        }));

        res.json({ success: true, reviews: populatedReviews });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteReview = async (req: Request, res: Response) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        const { targetId, targetType } = review;
        await Review.findByIdAndDelete(req.params.id);

        // Recalculate rating for the target
        await updateTargetRating(targetId.toString(), targetType);

        res.json({ success: true, message: "Review deleted" });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// --- PAYMENT MANAGEMENT ---
import Booking from "../models/Booking";
import { sendBookingConfirmationEmail } from "../services/emailService";

export const getManualPayments = async (req: Request, res: Response) => {
    try {
        const payments = await Booking.find({
            paymentMethod: 'manual_upi',
            manualPaymentStatus: 'pending_verification'
        })
            .populate("userId", "name email")
            .populate("stayId", "name")
            .sort({ createdAt: -1 });

        res.json({ success: true, payments });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const verifyManualPayment = async (req: Request, res: Response) => {
    try {
        const { bookingId, status } = req.body; // status: 'verified' or 'rejected'

        if (!['verified', 'rejected'].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const booking = await Booking.findById(bookingId).populate("stayId", "name");
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        booking.manualPaymentStatus = status;
        if (status === 'verified') {
            booking.paymentStatus = 'paid';
            booking.status = 'confirmed';
        } else {
            booking.paymentStatus = 'failed';
            booking.status = 'rejected';
        }

        await booking.save();

        // Send Email if verified
        if (status === 'verified') {
            const user = await User.findById(booking.userId);
            if (user && user.email) {
                await sendBookingConfirmationEmail(user.email, user.name || 'Valued Guest', {
                    id: booking._id,
                    stayName: (booking.stayId as any)?.name || 'Your Stay',
                    checkIn: booking.checkIn,
                    checkOut: booking.checkOut,
                    totalPrice: booking.totalPrice
                });
            }
        }

        res.json({
            success: true,
            message: `Payment ${status === 'verified' ? 'verified' : 'rejected'} successfully`,
            booking
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
