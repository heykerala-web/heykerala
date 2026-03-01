import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User, { IUser } from "../models/User";
import Place from "../models/Place";
import Stay from "../models/Stay";
import Event from "../models/Event";
import Booking from "../models/Booking";
import Review from "../models/Review";
import PlacePhoto from "../models/PlacePhoto";
import { getModelByType, updateTargetRating } from "../utils/reviewUtils";

// Update Profile (Name, Bio, Phone, Location)
export const updateProfile = async (req: any, res: Response): Promise<void> => {
    try {
        const { name, bio, phone, location, bankDetails } = req.body;
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        if (name) user.name = name;
        if (bio !== undefined) user.bio = bio;
        if (phone !== undefined) user.phone = phone;
        if (location !== undefined) user.location = location;
        if (bankDetails !== undefined) user.bankDetails = bankDetails;

        await user.save();

        res.json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                bio: user.bio,
                phone: user.phone,
                location: user.location,
                role: user.role,
                avatar: user.avatar,
                savedPlaces: user.savedPlaces,
                travelBadge: user.travelBadge,
                bankDetails: user.bankDetails
            },
        });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

// Get Current User with Stats (Overview)
export const getMe = async (req: any, res: Response): Promise<void> => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        // Aggregate stats
        const bookingCount = await Booking.countDocuments({ userId });
        const photoCount = await PlacePhoto.countDocuments({ user: userId });
        const contributionCount = (await Place.countDocuments({ createdBy: userId })) +
            (await Stay.countDocuments({ createdBy: userId })) +
            (await Event.countDocuments({ createdBy: userId })) +
            photoCount;
        const savedCount = user.savedPlaces.length;

        // Dynamic Badge Logic
        let currentBadge = "Explorer 🌍";
        if (contributionCount >= 5) currentBadge = "Trekker 🏔️";
        if (contributionCount >= 10) currentBadge = "Pathfinder 🧭";
        if (bookingCount >= 3) currentBadge = "Frequent Traveler ✈️";

        // Update user badge in DB if it changed
        if (user.travelBadge !== currentBadge) {
            user.travelBadge = currentBadge;
            await user.save();
        }

        res.json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                bio: user.bio,
                phone: user.phone,
                location: user.location,
                role: user.role,
                createdAt: (user as any).createdAt,
                travelBadge: currentBadge,
                stats: {
                    bookings: bookingCount,
                    contributions: contributionCount,
                    saved: savedCount
                }
            }
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

// Save an Item (Place, Stay, or Event)
export const saveItem = async (req: any, res: Response): Promise<void> => {
    try {
        const { type, id } = req.params;
        const userId = req.user.id;

        let model;
        let userField: keyof IUser;

        switch (type) {
            case "place":
                model = Place;
                userField = "savedPlaces";
                break;
            case "stay":
                model = Stay;
                userField = "savedStays";
                break;
            case "event":
                model = Event;
                userField = "savedEvents";
                break;
            default:
                res.status(400).json({ message: "Invalid item type" });
                return;
        }

        const item = await model.findById(id);
        if (!item) {
            res.status(404).json({ message: `${type} not found` });
            return;
        }

        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        // Check if already saved
        const fieldArray = user[userField] as any[];
        if (fieldArray.some((savedId: any) => savedId.toString() === id)) {
            res.status(400).json({ message: "Item already saved" });
            return;
        }

        // Add to saved array
        fieldArray.push(id as any);
        await user.save();

        res.json({ success: true, message: "Item saved successfully", [userField]: user[userField] });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

// Unsave an Item
export const unsaveItem = async (req: any, res: Response): Promise<void> => {
    try {
        const { type, id } = req.params;
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        let userField: keyof IUser;
        switch (type) {
            case "place": userField = "savedPlaces"; break;
            case "stay": userField = "savedStays"; break;
            case "event": userField = "savedEvents"; break;
            default:
                res.status(400).json({ message: "Invalid item type" });
                return;
        }

        const fieldArray = user[userField] as any[];
        user[userField] = fieldArray.filter((savedId: any) => savedId.toString() !== id) as any;
        await user.save();

        res.json({ success: true, message: "Item removed from saved", [userField]: user[userField] });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

// Get All Saved Items
export const getSavedItems = async (req: any, res: Response): Promise<void> => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId)
            .populate("savedPlaces")
            .populate("savedStays")
            .populate("savedEvents");

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        res.json({
            success: true,
            savedPlaces: user.savedPlaces,
            savedStays: user.savedStays,
            savedEvents: user.savedEvents
        });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

// Get User Reviews
export const getUserReviews = async (req: any, res: Response): Promise<void> => {
    try {
        const userId = req.user.id;
        const reviews = await Review.find({ user: userId }).sort({ createdAt: -1 });

        // Manually populate target data
        const populatedReviews = await Promise.all(reviews.map(async (review) => {
            const TargetModel = getModelByType(review.targetType);
            const targetData = TargetModel ? await TargetModel.findById(review.targetId).select("name title image images district") : null;

            return {
                ...review.toObject(),
                target: targetData ? {
                    _id: targetData._id,
                    name: (targetData as any).name || (targetData as any).title,
                    image: (targetData as any).image || (targetData as any).images?.[0],
                    type: review.targetType,
                    district: (targetData as any).district
                } : null
            };
        }));

        res.json({ success: true, reviews: populatedReviews });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

// Delete User Review
export const deleteReview = async (req: any, res: Response): Promise<void> => {
    try {
        const reviewId = req.params.reviewId;
        const userId = req.user.id;

        const review = await Review.findOne({ _id: reviewId, user: userId });
        if (!review) {
            res.status(404).json({ message: "Review not found" });
            return;
        }

        const { targetId, targetType } = review;
        await Review.findByIdAndDelete(reviewId);

        // Recalculate rating
        await updateTargetRating(targetId.toString(), targetType);

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

// Get User Bookings
export const getUserBookings = async (req: any, res: Response): Promise<void> => {
    try {
        const userId = req.user.id;
        const bookings = await Booking.find({ userId })
            .populate("stayId", "name images district")
            .populate("restaurantId", "name images district")
            .sort({ createdAt: -1 });

        res.json({ success: true, bookings });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

// Cancel Booking (User)
export const cancelBooking = async (req: any, res: Response): Promise<void> => {
    try {
        const userId = req.user.id;
        const { bookingId } = req.params;

        const booking = await Booking.findOne({ _id: bookingId, userId });
        if (!booking) {
            res.status(404).json({ message: "Booking not found" });
            return;
        }

        if (booking.status !== "pending") {
            // Note: In a real system, confirmed bookings might also be cancellable with separate logic.
            // For this scope, let's allow cancelling confirmed bookings too to test refunds, but block already cancelled/completed.
            if (booking.status === "cancelled" || booking.status === "completed") {
                res.status(400).json({ message: "Booking cannot be cancelled from its current state" });
                return;
            }
        }

        booking.status = "cancelled";

        // Refund Simulation
        if (booking.paymentStatus === "paid") {
            booking.paymentStatus = "refunded";
            // Here you would normally call the Razorpay reversal API
        }

        await booking.save();

        res.json({ success: true, message: booking.paymentStatus === "refunded" ? "Booking cancelled and refund initiated." : "Booking cancelled successfully" });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

// Delete Account
export const deleteAccount = async (req: any, res: Response): Promise<void> => {
    try {
        const userId = req.user.id;
        const { password } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        // Verify password
        if (user.password) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                res.status(400).json({ message: "Incorrect password" });
                return;
            }
        } else if (user.provider === "local") {
            res.status(400).json({ message: "Security error: No password set" });
            return;
        }

        // Perform deletion (or soft delete)
        await User.findByIdAndDelete(userId);
        // Note: In production, we'd also clean up bookings, reviews, etc., or anonymize them.

        res.json({ success: true, message: "Account deleted successfully" });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};
