import express from "express";
import {
    createBooking,
    createStayBooking,
    getUserBookings,
    getAllBookings,
    updateBookingStatus
} from "../controllers/bookingController";

const router = express.Router();

router.post("/", createBooking);
router.post("/stay", createStayBooking); // Specific route for stay bookings to avoid conflict
router.get("/user/:userId", getUserBookings);
router.get("/admin", getAllBookings);
router.put("/:id/status", updateBookingStatus);

export default router;