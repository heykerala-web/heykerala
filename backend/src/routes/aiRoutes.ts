import express from "express";
import rateLimit from "express-rate-limit";
import { getRecommendations } from "../controllers/aiRecommendationController";
import { chatWithAI } from "../controllers/aiChatController";
import { semanticSearch } from "../controllers/aiSearchController";
import { summarizeReviews } from "../controllers/aiReviewController";
import { generateUserPersona } from "../controllers/aiUserController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

// Rate Limiters
const chatLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // Limit each IP to 10 requests per windowMs
    message: { reply: "⚠️ AI is busy right now. Please wait 1 minute." },
    standardHeaders: true,
    legacyHeaders: false,
});

const recommendLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 5, // Limit each IP to 5 requests per windowMs
    message: { message: "⚠️ AI is busy right now. Please wait 1 minute." },
    standardHeaders: true,
    legacyHeaders: false,
});

// Optional protection: if user is logged in, we get personalized recs, else general ones
router.get("/recommendations", recommendLimiter, (req, res, next) => {
    // We use a custom version of protect that doesn't fail if no token is present
    const token = req.headers.authorization?.split(" ")[1];
    if (token) {
        return protect(req, res, next);
    }
    next();
}, getRecommendations);

router.post("/chat", chatLimiter, chatWithAI);

router.get("/search", semanticSearch);

router.get("/reviews/:targetId/summary", summarizeReviews);

// Persona Mapping
router.post("/persona/generate", protect, generateUserPersona);
router.get("/persona/:userId", generateUserPersona); // Also allow GET for convenience

export default router;
