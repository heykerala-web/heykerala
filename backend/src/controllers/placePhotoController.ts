import { Request, Response } from "express";
import PlacePhoto from "../models/PlacePhoto";
import mongoose from "mongoose";

// Upload a photo
export const uploadPhoto = async (req: Request, res: Response) => {
    try {
        const { placeId, caption } = req.body;
        const userId = (req as any).user._id;

        if (!req.file) {
            return res.status(400).json({ success: false, message: "No file uploaded" });
        }

        if (!mongoose.Types.ObjectId.isValid(placeId)) {
            return res.status(400).json({ success: false, message: "Invalid Place ID" });
        }

        // Create photo entry
        const photo = await PlacePhoto.create({
            place: placeId,
            user: userId,
            image: `/uploads/${req.file.filename}`,
            caption,
            status: "pending" // Default to pending
        });

        res.status(201).json({
            success: true,
            data: photo,
            message: "Photo uploaded successfully! It will be visible after approval."
        });

    } catch (error: any) {
        console.error("Error uploading photo:", error);
        res.status(500).json({ success: false, message: "Upload failed", error: error.message });
    }
};

// Get approved photos for a place
export const getPlacePhotos = async (req: Request, res: Response) => {
    try {
        const { placeId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(placeId)) {
            return res.status(400).json({ success: false, message: "Invalid Place ID" });
        }

        const photos = await PlacePhoto.find({ place: placeId, status: "approved" })
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
