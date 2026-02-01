import express from "express";
import { protect } from "../middleware/authMiddleware";
import {
    createReview,
    getTargetReviews,
    updateReview,
    deleteReview,
    getRatingBreakdown
} from "../controllers/reviewController";

const router = express.Router();

// Public: Get reviews for any target (place, stay, event)
router.get("/:targetId", getTargetReviews);

// Public: Get rating breakdown for any target
router.get("/breakdown/:targetId", getRatingBreakdown);

// Protected: Create review
router.post("/", protect, createReview);

// Protected: Update review
router.put("/:id", protect, updateReview);

// Protected: Delete review (Admin or Owner)
router.delete("/:id", protect, deleteReview);

export default router;
