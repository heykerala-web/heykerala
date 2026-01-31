import express from "express";
import { protect } from "../middleware/authMiddleware";
import { createReview, getPlaceReviews } from "../controllers/reviewController";

const router = express.Router();

// Protected: Create review
router.post("/", protect, createReview);

// Public: Get reviews for a place
router.get("/place/:placeId", getPlaceReviews);

export default router;
