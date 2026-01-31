import express from "express";
import { protect } from "../middleware/authMiddleware";
import {
    updateProfile,
    changePassword,
    savePlace,
    unsavePlace,
    getSavedPlaces,
    getUserSubmissions,
} from "../controllers/userController";

const router = express.Router();

// Profile Routes
router.put("/profile", protect, updateProfile);
router.put("/password", protect, changePassword);

// Saved Places Routes
router.get("/saved", protect, getSavedPlaces);
router.post("/save/:placeId", protect, savePlace);
router.delete("/save/:placeId", protect, unsavePlace);

// Review Routes
import { getUserReviews, deleteReview } from "../controllers/userController";
router.get("/reviews", protect, getUserReviews);
router.delete("/reviews/:reviewId", protect, deleteReview);

// Submissions
router.get("/submissions", protect, getUserSubmissions);

export default router;
