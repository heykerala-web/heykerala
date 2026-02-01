import express from "express";
import { protect, authorize } from "../middleware/authMiddleware";
import { upload } from "../middleware/uploadMiddleware";
import {
    uploadPhoto,
    getPlacePhotos,
    getUserPhotos,
    deletePhoto
} from "../controllers/placePhotoController";

const router = express.Router();

// Public
router.get("/:placeId", getPlacePhotos);

// Protected
router.post("/upload", protect, upload.single("image"), uploadPhoto);
router.get("/user/me", protect, getUserPhotos);
router.delete("/:id", protect, deletePhoto);

export default router;
