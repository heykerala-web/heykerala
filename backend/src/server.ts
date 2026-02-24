import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import passport from "passport";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { seedStays } from "./seed/seedStays";
import { migrateStays } from "./seed/migrateStays";

// Load Env
dotenv.config();
console.log("ENV loaded");
console.log("Forcing restart to apply RBAC changes...");

// DB + Passport Config
import connectDB from "./config/db";
import "./utils/passportConfig";

// Existing Routes
import authRoutes from "./routes/authRoutes";
import profileRoutes from "./routes/profileRoutes";
import userRoutes from "./routes/userRoutes";

// ⭐ New Plan My Trip Routes
import itineraryRoutes from "./routes/itineraryRoutes";
import itinerariesRoutes from "./routes/itinerariesRoutes";
import packageRoutes from "./routes/packageRoutes";
import bookingRoutes from "./routes/bookingRoutes";
import aiRoutes from "./routes/aiRoutes";

const app = express();

// Security Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" } // Allow images to be loaded across origins
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // Increased limit for development/testing
  message: { message: "Too many requests from this IP, please try again after 15 minutes" }
});
app.use("/api/", limiter);

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(passport.initialize());

// Serve Uploads
app.use("/uploads", express.static("uploads"));

// Base Route
app.get("/", (req: Request, res: Response) => {
  res.send("Hey Kerala Backend running successfully! 🚀");
});

// Existing Routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/users", userRoutes);

// ⭐ Plan My Trip API Routes
app.use("/api/itinerary", itineraryRoutes);
app.use("/api/itineraries", itinerariesRoutes);
app.use("/api/packages", packageRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/ai", aiRoutes);

// ⭐ Places & Weather Routes
import placeRoutes from "./routes/placeRoutes";
import weatherRoutes from "./routes/weatherRoutes";
import adminRoutes from "./routes/adminRoutes"; // Import Admin Routes
import uploadRoutes from "./routes/uploadRoutes"; // Import Upload Routes

app.use("/api/places", placeRoutes);
import stayRoutes from "./routes/stayRoutes";
app.use("/api/stays", stayRoutes);
import eventRoutes from "./routes/eventRoutes";
app.use("/api/events", eventRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/admin", adminRoutes); // Use Admin Routes
app.use("/api/upload", uploadRoutes); // Use Upload Routes

import reviewRoutes from "./routes/reviewRoutes";
app.use("/api/reviews", reviewRoutes);

import placePhotoRoutes from "./routes/placePhotoRoutes";
app.use("/api/place-photos", placePhotoRoutes);

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error("🔥 Server Error:", err.stack);
  res.status(500).json({ message: "Server error", error: err.message });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);

  try {
    await connectDB();
    console.log("MongoDB Connected");

    // Seed Stays if needed
    await seedStays();

    // Migrate old data
    await migrateStays();

  } catch (err: any) {
    console.error("MongoDB Connection Error:", err.message);
  }
});
