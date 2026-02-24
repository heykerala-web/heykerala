import express from "express";
const passport = require("passport");

import jwt from "jsonwebtoken";
import { registerUser, loginUser, getMe, updateRole, forgotPassword, resetPassword } from "../controllers/authController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

// Email Register & Login
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected route to get logged-in user
router.get("/me", protect, getMe);

// Update user role
router.patch("/role", protect, updateRole);

// Forgot & Reset Password
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:resettoken", resetPassword);

// ------------------------
// GOOGLE LOGIN
// ------------------------ 
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req: any, res) => {
    const token = jwt.sign(
      { id: req.user._id },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );
    res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${token}`);
  }
);

// ------------------------
// FACEBOOK LOGIN
// ------------------------
router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { session: false }),
  (req: any, res) => {
    const token = jwt.sign(
      { id: req.user._id },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );
    res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${token}`);
  }
);

export default router;
