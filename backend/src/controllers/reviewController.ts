import { Request, Response } from "express";
import mongoose from "mongoose";
import Review from "../models/Review";
import Place from "../models/Place";
import Stay from "../models/Stay";
import Event from "../models/Event";

import { getModelByType, updateTargetRating } from "../utils/reviewUtils";

// Create a review
export const createReview = async (req: Request, res: Response) => {
    try {
        const { targetId, targetType, rating, title, comment } = req.body;
        const userId = (req as any).user._id;

        if (targetType !== "app") {
            const TargetModel = getModelByType(targetType);
            if (!TargetModel) {
                return res.status(400).json({ success: false, message: "Invalid target type" });
            }

            const target = await TargetModel.findById(targetId);
            if (!target) {
                return res.status(404).json({ success: false, message: `${targetType} not found` });
            }
        }

        // Check if user already reviewed
        const existingReview = await Review.findOne({ user: userId, targetId, targetType });
        if (existingReview) {
            return res.status(400).json({ success: false, message: `You have already reviewed this ${targetType}` });
        }

        // Create review
        const review = await Review.create({
            user: userId,
            targetId,
            targetType,
            rating,
            title,
            comment,
        });

        // Recalculate Rating
        const newRatings = await updateTargetRating(targetId, targetType);

        // Log Activity
        const { logActivity } = await import("../utils/activityLogger");
        await logActivity(userId, "REVIEW_ADDED", `User reviewed ${targetType} ${targetId}`, req);

        res.status(201).json({
            success: true,
            data: review,
            ratingInfo: newRatings
        });
    } catch (error: any) {
        console.error("Error creating review:", error);
        res.status(500).json({
            success: false,
            message: "Error creating review",
            error: error.message,
        });
    }
};

// Get reviews for a target
export const getTargetReviews = async (req: Request, res: Response) => {
    try {
        const { targetId } = req.params;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 5;
        const skip = (page - 1) * limit;

        const reviews = await Review.find({ targetId })
            .populate("user", "name avatar")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Review.countDocuments({ targetId });

        res.json({
            success: true,
            data: reviews,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Error fetching reviews",
            error: error.message,
        });
    }
};

// Update a review
export const updateReview = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { rating, title, comment } = req.body;
        const userId = (req as any).user._id;

        const review = await Review.findById(id);
        if (!review) {
            return res.status(404).json({ success: false, message: "Review not found" });
        }

        // Check ownership
        if (review.user.toString() !== userId.toString()) {
            return res.status(403).json({ success: false, message: "Unauthorized" });
        }

        review.rating = rating || review.rating;
        review.title = title !== undefined ? title : review.title;
        review.comment = comment || review.comment;
        await review.save();

        // Recalculate Rating
        const newRatings = await updateTargetRating(review.targetId.toString(), review.targetType);

        res.json({
            success: true,
            data: review,
            ratingInfo: newRatings
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Error updating review",
            error: error.message,
        });
    }
};

// Delete a review
export const deleteReview = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = (req as any).user._id;
        const isAdmin = (req as any).user.role === "admin";

        const review = await Review.findById(id);
        if (!review) {
            return res.status(404).json({ success: false, message: "Review not found" });
        }

        // Check ownership or admin status
        if (review.user.toString() !== userId.toString() && !isAdmin) {
            return res.status(403).json({ success: false, message: "Unauthorized" });
        }

        const { targetId, targetType } = review;
        await Review.findByIdAndDelete(id);

        // Recalculate Rating
        const newRatings = await updateTargetRating(targetId.toString(), targetType);

        res.json({
            success: true,
            message: "Review deleted successfully",
            ratingInfo: newRatings
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Error deleting review",
            error: error.message,
        });
    }
};

// Get Rating Breakdown
export const getRatingBreakdown = async (req: Request, res: Response) => {
    try {
        const { targetId } = req.params;

        const stats = await Review.aggregate([
            { $match: { targetId: new mongoose.Types.ObjectId(targetId) } },
            {
                $group: {
                    _id: "$rating",
                    count: { $sum: 1 }
                }
            }
        ]);

        const totalReviews = stats.reduce((acc, item) => acc + item.count, 0);

        // Initialize breakdown with 0s
        const breakdown: Record<number, { count: number; percentage: number }> = {
            1: { count: 0, percentage: 0 },
            2: { count: 0, percentage: 0 },
            3: { count: 0, percentage: 0 },
            4: { count: 0, percentage: 0 },
            5: { count: 0, percentage: 0 }
        };

        stats.forEach(item => {
            breakdown[item._id] = {
                count: item.count,
                percentage: totalReviews > 0 ? Math.round((item.count / totalReviews) * 100) : 0
            };
        });

        res.json({
            success: true,
            data: {
                totalReviews,
                breakdown
            }
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Error fetching rating breakdown",
            error: error.message,
        });
    }
};
// Get latest reviews (for Home screen)
export const getLatestReviews = async (req: Request, res: Response) => {
    try {
        const limit = parseInt(req.query.limit as string) || 6;
        const targetType = req.query.targetType as string;

        const query = targetType ? { targetType } : {};

        const reviews = await Review.find(query)
            .populate("user", "name avatar")
            .sort({ createdAt: -1 })
            .limit(limit);

        res.json({
            success: true,
            data: reviews
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Error fetching latest reviews",
            error: error.message,
        });
    }
};

// Get all reviews with filters
export const getAllReviews = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;
        const targetType = req.query.targetType as string;

        const query = targetType ? { targetType } : {};

        const reviews = await Review.find(query)
            .populate("user", "name avatar")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Review.countDocuments(query);

        res.json({
            success: true,
            data: reviews,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Error fetching all reviews",
            error: error.message,
        });
    }
};
