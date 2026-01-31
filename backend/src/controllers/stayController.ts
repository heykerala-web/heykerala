import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Stay from '../models/Stay';

// Add new stay
export const addStay = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = (req as any).user;
        const role = user?.role;

        const stayData = {
            ...req.body,
            status: role === 'Admin' ? 'approved' : 'pending', // Admins auto-approve
            createdBy: user?._id
        };

        const stay = await Stay.create(stayData);
        res.status(201).json({
            success: true,
            data: stay
        });
    } catch (err) {
        next(err);
    }
};

// Submit new stay (User)
export const submitStay = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user._id;
        const stay = await Stay.create({
            ...req.body,
            status: 'pending',
            createdBy: userId
        });
        res.status(201).json({ message: 'Stay submitted successfully', stay });
    } catch (err) {
        next(err);
    }
};

// List all stays with filters
export const getStays = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { district, type, minPrice, maxPrice, search } = req.query;
        let query: any = {
            $or: [{ status: 'approved' }, { status: { $exists: false } }]
        };

        if (district) {
            query.district = { $regex: new RegExp(district as string, 'i') };
        }
        if (type && type !== 'All Types') {
            const types = (type as string).split(',').filter(t => t !== 'All Types');
            if (types.length > 0) {
                query.type = { $in: types };
            }
        }
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }
        if (search) {
            query.$or = [
                { name: { $regex: new RegExp(search as string, 'i') } },
                { district: { $regex: new RegExp(search as string, 'i') } }
            ];
        }

        const stays = await Stay.find(query).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: stays
        });
    } catch (err) {
        next(err);
    }
};

// Admin List Stays (All Statuses)
export const getAdminStays = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // No status filter, return everything
        const stays = await Stay.find({}).sort({ createdAt: -1 }).populate('createdBy', 'name email');
        res.status(200).json(stays);
    } catch (err) {
        next(err);
    }
};

// Get single stay details
export const getStayById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Stay ID format",
            });
        }

        const stay = await Stay.findById(id);
        if (!stay) {
            return res.status(404).json({
                success: false,
                message: 'Stay not found'
            });
        }
        const isApproved = stay.status === 'approved' || !stay.status;
        const isAdmin = (req as any).user && (req as any).user.role === 'Admin';

        if (!isApproved && !isAdmin) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }
        res.status(200).json({
            success: true,
            data: stay
        });
    } catch (err) {
        next(err);
    }
};

// Update stay
export const updateStay = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Stay ID format",
            });
        }

        const stay = await Stay.findByIdAndUpdate(id, req.body, { new: true });
        if (!stay) {
            return res.status(404).json({
                success: false,
                message: 'Stay not found'
            });
        }
        res.status(200).json({
            success: true,
            data: stay
        });
    } catch (err) {
        next(err);
    }
};

// Delete stay
export const deleteStay = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Stay ID format",
            });
        }

        const stay = await Stay.findByIdAndDelete(id);
        if (!stay) {
            return res.status(404).json({
                success: false,
                message: 'Stay not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Stay deleted successfully'
        });
    } catch (err) {
        next(err);
    }
};


