import { Request, Response } from "express";
import User from "../models/User";
import Place from "../models/Place";
import Review from "../models/Review";
import Stay from "../models/Stay";
import Event from "../models/Event";

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
        await Place.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Place deleted" });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// --- REVIEW MANAGEMENT ---

export const getAllReviews = async (req: Request, res: Response) => {
    try {
        const reviews = await Review.find()
            .populate("user", "name email")
            .populate("place", "name")
            .sort({ createdAt: -1 });
        res.json({ success: true, reviews });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteReview = async (req: Request, res: Response) => {
    try {
        await Review.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Review deleted" });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
