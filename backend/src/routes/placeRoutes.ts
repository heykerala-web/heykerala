import express from "express";
import { protect, authorize } from "../middleware/authMiddleware";
import {
  getPlaceBySlug,
  getAllPlaces,
  createPlace,
  submitPlace,
  getPlaceById,
  getNearbyPlaces,
  updatePlace,
  deletePlace,
  getSearchSuggestions,
} from "../controllers/placeController";

const router = express.Router();

// Public
router.get("/suggestions", getSearchSuggestions);
router.get("/", getAllPlaces);
router.get("/:id", getPlaceById);
router.get("/:id/nearby", getNearbyPlaces);
router.get("/slug/:slug", getPlaceBySlug);

// Admin / Protected
router.post("/user/submission", protect, submitPlace); // User submission
router.post("/", protect, authorize("Admin"), createPlace);
router.put("/:id", protect, authorize("Admin"), updatePlace);
router.delete("/:id", protect, authorize("Admin"), deletePlace);

export default router;






