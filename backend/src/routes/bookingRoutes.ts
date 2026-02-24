import express from "express";
import {
    createBooking,
    createStayBooking,
    getUserBookings,
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
router.get("/user/:userId", getUserBookings);

// Admin only routes
router.get("/admin", authorize("Admin"), getAllBookings);
router.put("/:id/status", authorize("Admin"), updateBookingStatus);

export default router;