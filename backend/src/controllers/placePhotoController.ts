import { Request, Response } from "express";
import PlacePhoto from "../models/PlacePhoto";
import User from "../models/User";
import mongoose from "mongoose";

// Upload a photo
export const uploadPhoto = async (req: Request, res: Response) => {
    try {
        const { placeId, eventId, caption, targetType } = req.body;
        const userId = (req as any).user._id;

        if (!req.file) {
            return res.status(400).json({ success: false, message: "No file uploaded" });
        }

        const photoData: any = {
            user: userId,
            image: `/uploads/${req.file.filename}`,
            caption,
            status: "approved", // Directly approved as requested
            targetType: targetType || (placeId ? "place" : "event")
        };

        if (placeId && mongoose.Types.ObjectId.isValid(placeId)) {
            photoData.place = placeId;
        } else if (eventId && mongoose.Types.ObjectId.isValid(eventId)) {
            photoData.event = eventId;
        } else {
            return res.status(400).json({ success: false, message: "Invalid Place or Event ID" });
        }

        // Create photo entry
        const photo = await PlacePhoto.create(photoData);

        // Update User Contribution Count
        await User.findByIdAndUpdate(userId, { $inc: { contributionCount: 1 } });

        res.status(201).json({
            success: true,
            data: photo,
            message: "Photo uploaded successfully! Your contribution has been recorded."
        });

    } catch (error: any) {
        console.error("Error uploading photo:", error);
        res.status(500).json({ success: false, message: "Upload failed", error: error.message });
    }
};

// Get approved photos for a place or event
export const getPlacePhotos = async (req: Request, res: Response) => {
    try {
        const { placeId } = req.params; // This will be used as the targetId
        const { type } = req.query; // Optional type filter

        if (!mongoose.Types.ObjectId.isValid(placeId)) {
            return res.status(400).json({ success: false, message: "Invalid ID" });
        }

        const query: any = { status: "approved" };
        if (type === "event") {
            query.event = placeId;
        } else if (type === "place") {
            query.place = placeId;
        } else {
            // Default to checking both if type not specified (though usually it should be)
            query.$or = [{ place: placeId }, { event: placeId }];
        }

        const photos = await PlacePhoto.find(query)
            .populate("user", "name avatar")
            .sort({ createdAt: -1 });

        res.json({ success: true, count: photos.length, data: photos });
    } catch (error: any) {
        res.status(500).json({ success: false, message: "Error fetching photos", error: error.message });
    }
};

// Get user's photos
export const getUserPhotos = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user._id;

        const photos = await PlacePhoto.find({ user: userId })
            .populate("place", "name district image")
            .populate("event", "title district images")
            .sort({ createdAt: -1 });

        res.json({ success: true, count: photos.length, data: photos });
    } catch (error: any) {
        res.status(500).json({ success: false, message: "Error fetching user photos", error: error.message });
    }
};

// Delete a photo (User own or Admin)
export const deletePhoto = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = (req as any).user._id;
        const userRole = (req as any).user.role;

        const photo = await PlacePhoto.findById(id);

        if (!photo) {
            return res.status(404).json({ success: false, message: "Photo not found" });
        }

        // Check ownership or admin
        if (photo.user.toString() !== userId.toString() && userRole !== "Admin") {
            return res.status(403).json({ success: false, message: "Not authorized to delete this photo" });
        }

        await photo.deleteOne();

        res.json({ success: true, message: "Photo deleted" });
    } catch (error: any) {
        res.status(500).json({ success: false, message: "Error deleting photo", error: error.message });
    }
};
