import express from "express";
import { getRecommendations } from "../controllers/aiRecommendationController";
import { chatWithAI } from "../controllers/aiChatController";
import { semanticSearch } from "../controllers/aiSearchController";
import { summarizeReviews } from "../controllers/aiReviewController";
import { generateUserPersona } from "../controllers/aiUserController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

// Optional protection: if user is logged in, we get personalized recs, else general ones
router.get("/recommendations", (req, res, next) => {
    // We use a custom version of protect that doesn't fail if no token is present
    const token = req.headers.authorization?.split(" ")[1];
    if (token) {
        return protect(req, res, next);
    }
    next();
}, getRecommendations);

router.post("/chat", chatWithAI);

router.get("/search", semanticSearch);

router.get("/reviews/:targetId/summary", summarizeReviews);

// Persona Mapping
router.post("/persona/generate", protect, generateUserPersona);
router.get("/persona/:userId", generateUserPersona); // Also allow GET for convenience

export default router;
