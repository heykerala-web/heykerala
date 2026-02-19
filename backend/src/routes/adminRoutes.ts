import express from "express";
import { protect, authorize } from "../middleware/authMiddleware";
import {
    getStats,
    getAllUsers,
    updateUserRole,
    deleteUser,
    getAllPlaces,
    deletePlace,
    getAllReviews,
    deleteReview,
    getPendingSubmissions,
    approveSubmission,
    rejectSubmission,
    deleteSubmission,
    getActivityLogs
} from "../controllers/adminController";
import { createPlace, updatePlace } from "../controllers/placeController"; // Reuse standard place logic
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

// Upload config for admin place creation
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
    destination: function (_req, _file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (_req, file, cb) {
        const safeName = `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`;
        cb(null, safeName);
    },
});

const upload = multer({ storage });

// Protect all routes
router.use(protect);
router.use(authorize("Admin"));

// Dashboard
router.get("/stats", getStats);
router.get("/activity", getActivityLogs);

// Users
router.get("/users", getAllUsers);
router.put("/users/:id/role", updateUserRole);
router.delete("/users/:id", deleteUser);

// Places
router.get("/places", getAllPlaces);
router.post("/places", createPlace); // JSON payload with image URLs
router.put("/places/:id", updatePlace);
router.delete("/places/:id", deletePlace);

// Reviews
router.get("/reviews", getAllReviews);
router.delete("/reviews/:id", deleteReview);

// Submissions (Places, Stays, Events)
router.get("/submissions", getPendingSubmissions);
router.put("/submissions/:type/:id/approve", approveSubmission);
router.put("/submissions/:type/:id/reject", rejectSubmission);
router.delete("/submissions/:type/:id", deleteSubmission);

export default router;
