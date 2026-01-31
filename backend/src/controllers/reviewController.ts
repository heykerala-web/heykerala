import { Request, Response } from "express";
import Review from "../models/Review";
import Place from "../models/Place";

// Create a review
export const createReview = async (req: Request, res: Response) => {
    try {
        const { placeId, rating, comment } = req.body;
        const userId = (req as any).user._id;

        const place = await Place.findById(placeId);
        if (!place) {
            return res.status(404).json({ success: false, message: "Place not found" });
        }

        // Check if user already reviewed
        const existingReview = await Review.findOne({ user: userId, place: placeId });
        if (existingReview) {
            return res.status(400).json({ success: false, message: "You have already reviewed this place" });
        }

        // Create review
        const review = await Review.create({
            user: userId,
            place: placeId,
            rating,
            comment,
        });

        // Recalculate Place Rating
        const reviews = await Review.find({ place: placeId });
        const totalReviews = reviews.length;
        const avgRating =
            reviews.reduce((acc, item) => item.rating + acc, 0) / totalReviews;

        place.ratingAvg = parseFloat(avgRating.toFixed(1));
        place.totalReviews = totalReviews;
        await place.save();

        res.status(201).json({
            success: true,
            data: review,
            placeRating: place.ratingAvg
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

// Get reviews for a place
export const getPlaceReviews = async (req: Request, res: Response) => {
    try {
        const { placeId } = req.params;

        const reviews = await Review.find({ place: placeId })
            .populate("user", "name avatar")
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: reviews,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Error fetching reviews",
            error: error.message,
        });
    }
};
