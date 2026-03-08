import express from "express";
import { protect, authorize, requireContributor } from "../middleware/authMiddleware";
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
  getTrendingPlaces,
  incrementPlaceView,
  incrementSearchClick,
  incrementBookmarkClick,
} from "../controllers/placeController";

const router = express.Router();

// Public
router.get("/suggestions", getSearchSuggestions);
router.get("/trending", getTrendingPlaces); // Must be before /:id
router.get("/", getAllPlaces);
router.get("/:id", getPlaceById);
router.get("/:id/nearby", getNearbyPlaces);
router.get("/slug/:slug", getPlaceBySlug);

// Interaction tracking
router.post("/:id/view", incrementPlaceView);
router.post("/:id/search-click", incrementSearchClick);
router.post("/:id/bookmark-click", incrementBookmarkClick);

// Admin / Protected
router.post("/user/submission", protect, requireContributor, submitPlace); // User submission
router.post("/", protect, authorize("Admin"), createPlace);
router.put("/:id", protect, authorize("Admin"), updatePlace);
router.delete("/:id", protect, authorize("Admin"), deletePlace);

export default router;






