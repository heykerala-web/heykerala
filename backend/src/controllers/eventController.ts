import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Event from '../models/Event';
import Review from '../models/Review';

// Add new event (Admin)
export const addEvent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, description, category, district, venue, startDate, endDate, time, images, latitude, longitude } = req.body;

        if (!title || !startDate || !endDate) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        const event = await Event.create({
            title, description, category, district, venue,
            startDate, endDate, time, images, latitude, longitude,
            status: 'approved'
        });

        res.status(201).json({
            success: true,
            data: event
        });
    } catch (err) {
        next(err);
    }
};

// Submit new event (User)
export const submitEvent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user._id;
        const { title, description, category, district, venue, startDate, endDate, time, images, latitude, longitude } = req.body;

        if (!title || !startDate || !endDate) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        // Date Validation
        const start = new Date(startDate);
        const end = new Date(endDate);
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        if (start < now) {
            return res.status(400).json({ success: false, message: "Start date cannot be in the past" });
        }
        if (end < start) {
            return res.status(400).json({ success: false, message: "End date must be after start date" });
        }

        const event = await Event.create({
            title, description, category, district, venue,
            startDate, endDate, time, images, latitude, longitude,
            status: 'pending',
            createdBy: userId
        });
        res.status(201).json({ message: 'Event submitted successfully', event });
    } catch (err) {
        next(err);
    }
};

// List all events with filters
export const getEvents = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { district, category, date, search, status } = req.query;
        const isAdmin = (req as any).user && (req as any).user.role === 'Admin';

        let query: any = {};

        if (isAdmin) {
            // Admin sees all events; optionally filter by status
            if (status) {
                query.status = status;
            }
        } else {
            // Public sees only approved events
            query.$or = [{ status: 'approved' }, { status: { $exists: false } }];
        }

        if (district) {
            query.district = { $regex: new RegExp(district as string, 'i') };
        }
        if (category && category !== 'all') {
            query.category = { $regex: new RegExp(category as string, 'i') };
        }
        if (date) {
            const selectedDate = new Date(date as string);
            const startOfDay = new Date(selectedDate.setHours(0, 0, 0, 0));
            const endOfDay = new Date(selectedDate.setHours(23, 59, 59, 999));

            query.startDate = { $lte: endOfDay };
            query.endDate = { $gte: startOfDay };
        }
        if (search) {
            query.$or = [
                { title: { $regex: new RegExp(search as string, 'i') } },
                { district: { $regex: new RegExp(search as string, 'i') } },
                { venue: { $regex: new RegExp(search as string, 'i') } }
            ];
        }

        const events = await Event.find(query).sort({ startDate: 1 });
        res.status(200).json({
            success: true,
            data: events
        });
    } catch (err) {
        next(err);
    }
};

// Get single event details
export const getEventById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Event ID format",
            });
        }

        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }
        const isApproved = event.status === 'approved' || !event.status;
        const isAdmin = (req as any).user && (req as any).user.role === 'Admin';

        if (!isApproved && !isAdmin) {
            return res.status(403).json({
                success: false,
                message: 'Event pending approval'
            });
        }
        res.status(200).json({
            success: true,
            data: event
        });
    } catch (err) {
        next(err);
    }
};

// Update event
export const updateEvent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Event ID format",
            });
        }

        // Whitelist updates
        const updateData: any = {};
        const allowedFields = ['title', 'description', 'category', 'district', 'venue', 'startDate', 'endDate', 'time', 'images', 'latitude', 'longitude', 'status'];

        Object.keys(req.body).forEach(key => {
            if (allowedFields.includes(key)) {
                updateData[key] = req.body[key];
            }
        });

        const event = await Event.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }
        res.status(200).json({
            success: true,
            data: event
        });
    } catch (err) {
        next(err);
    }
};

// Delete event
export const deleteEvent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Event ID format",
            });
        }

        const event = await Event.findByIdAndDelete(id);
        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        // Cascading delete reviews
        await Review.deleteMany({ targetId: id, targetType: "event" });
        res.status(200).json({
            success: true,
            message: 'Event deleted successfully'
        });
    } catch (err) {
        next(err);
    }
};
