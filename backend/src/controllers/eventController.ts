import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Event from '../models/Event';

// Add new event (Admin)
export const addEvent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const event = await Event.create({ ...req.body, status: 'approved' });
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
        const event = await Event.create({
            ...req.body,
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
        const query: any = {
            $or: [{ status: 'approved' }, { status: { $exists: false } }]
        };

        if ((req as any).user && (req as any).user.role === 'Admin' && status) {
            query.status = status;
        }

        if (district) {
            query.district = { $regex: new RegExp(district as string, 'i') };
        }
        if (category) {
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

        const event = await Event.findByIdAndUpdate(id, req.body, { new: true });
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
        res.status(200).json({
            success: true,
            message: 'Event deleted successfully'
        });
    } catch (err) {
        next(err);
    }
};
