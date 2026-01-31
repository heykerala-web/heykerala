import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User, { IUser } from "../models/User";
import Place from "../models/Place";
import Stay from "../models/Stay";
import Event from "../models/Event";

// Update Profile (Name, Bio)
export const updateProfile = async (req: any, res: Response): Promise<void> => {
    try {
        const { name, bio } = req.body;
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        if (name) user.name = name;
        if (bio !== undefined) user.bio = bio;

        await user.save();

        res.json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                bio: user.bio,
                role: user.role,
                avatar: user.avatar,
                savedPlaces: user.savedPlaces
            },
        });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

// Change Password
export const changePassword = async (req: any, res: Response): Promise<void> => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        if (!user.password) {
            res.status(400).json({ message: "User does not have a password set (Social Login?)" });
            return;
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            res.status(400).json({ message: "Incorrect current password" });
            return;
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.json({ success: true, message: "Password updated successfully" });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

// Save a Place
export const savePlace = async (req: any, res: Response): Promise<void> => {
    try {
        const { placeId } = req.params;
        const userId = req.user.id;

        const place = await Place.findById(placeId);
        if (!place) {
            res.status(404).json({ message: "Place not found" });
            return;
        }

        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        // Check if already saved
        if (user.savedPlaces.some((id) => id.toString() === placeId)) {
            res.status(400).json({ message: "Place already saved" });
            return;
        }

        // Add to savedPlaces
        user.savedPlaces.push(place._id as any);
        await user.save();

        res.json({ success: true, message: "Place saved successfully", savedPlaces: user.savedPlaces });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

// Unsave a Place
export const unsavePlace = async (req: any, res: Response): Promise<void> => {
    try {
        const { placeId } = req.params;
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        user.savedPlaces = user.savedPlaces.filter((id) => id.toString() !== placeId);
        await user.save();

        res.json({ success: true, message: "Place removed from saved", savedPlaces: user.savedPlaces });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

// Get Saved Places
export const getSavedPlaces = async (req: any, res: Response): Promise<void> => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId).populate("savedPlaces");
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        res.json({ success: true, savedPlaces: user.savedPlaces });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

// Get User Reviews
import Review from "../models/Review";

export const getUserReviews = async (req: any, res: Response): Promise<void> => {
    try {
        const userId = req.user.id;
        const reviews = await Review.find({ user: userId }).populate("place", "name image location");

        res.json({ success: true, reviews });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

// Delete User Review
export const deleteReview = async (req: any, res: Response): Promise<void> => {
    try {
        const reviewId = req.params.reviewId;
        const userId = req.user.id;

        const review = await Review.findOneAndDelete({ _id: reviewId, user: userId });
        if (!review) {
            res.status(404).json({ message: "Review not found" });
            return;
        }

        res.json({ success: true, message: "Review deleted successfully" });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

// Get User Submissions
export const getUserSubmissions = async (req: any, res: Response): Promise<void> => {
    try {
        const userId = req.user.id;

        const places = await Place.find({ createdBy: userId });
        const stays = await Stay.find({ createdBy: userId });
        const events = await Event.find({ createdBy: userId });

        const submissions = [
            ...places.map(p => ({ ...p.toObject(), type: "Place" })),
            ...stays.map(s => ({ ...s.toObject(), type: "Stay" })),
            ...events.map(e => ({ ...e.toObject(), type: "Event" }))
        ];

        // Sort by createdAt desc
        submissions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        res.json({ success: true, submissions });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};
