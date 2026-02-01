import express from "express";
import { protect } from "../middleware/authMiddleware";
import {
    saveItem,
    unsaveItem,
    getSavedItems,
    getUserSubmissions,
    getMe,
    getUserBookings,
    cancelBooking,
    deleteAccount,
    updateProfile,
    changePassword
} from "../controllers/userController";

const router = express.Router();

// Profile Routes
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);
router.put("/password", protect, changePassword);
router.delete("/account", protect, deleteAccount);

// Saved Items Routes
router.get("/saved", protect, getSavedItems);
router.post("/save/:type/:id", protect, saveItem);
router.delete("/save/:type/:id", protect, unsaveItem);

// Review Routes
import { getUserReviews, deleteReview } from "../controllers/userController";
router.get("/reviews", protect, getUserReviews);
router.delete("/reviews/:reviewId", protect, deleteReview);

// Submissions
router.get("/submissions", protect, getUserSubmissions);

// Bookings
router.get("/bookings", protect, getUserBookings);
router.put("/bookings/:bookingId/cancel", protect, cancelBooking);

// Notifications (Scalable placeholder)
router.get("/notifications", protect, (req, res) => {
    res.json({ success: true, notifications: [] });
});

export default router;
