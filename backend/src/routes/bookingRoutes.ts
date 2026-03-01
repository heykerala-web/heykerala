import express from "express";
import {
    createBooking,
    createStayBooking,
    createRestaurantBooking,
    getUserBookings,
    getContributorBookings,
    getAllBookings,
    updateBookingStatus
} from "../controllers/bookingController";
import { protect, authorize } from "../middleware/authMiddleware";

const router = express.Router();

// Publicly accessible for creating bookings (maybe? usually needs login for history)
// Actually, in many travel apps, you can book as guest, but the request asks for STRICT validation.
// Let's protect them as per the implementation plan.
router.use(protect);

router.post("/", createBooking);
router.post("/stay", createStayBooking);
router.post("/restaurant", createRestaurantBooking);
router.get("/user/:userId", getUserBookings);

// Contributor routes
router.get("/contributor", authorize("Contributor", "Admin"), getContributorBookings);
router.put("/:id/status", authorize("Contributor", "Admin"), updateBookingStatus);

// Admin only routes
router.get("/admin", authorize("Admin"), getAllBookings);

export default router;