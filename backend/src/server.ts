import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import passport from "passport";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import compression from "compression";
import { seedStays } from "./seed/seedStays";
import { migrateStays } from "./seed/migrateStays";

// Load Env
dotenv.config();
console.log("ENV loaded");

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
import paymentRoutes from "./routes/paymentRoutes";
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
app.use(compression()); // Enable gzip/Brotli compression for all responses
app.use(express.json());
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        process.env.FRONTEND_URL,
        "http://localhost:3000",
        "http://127.0.0.1:3000"
      ].filter(Boolean);

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        // Permissive in dev to avoid deployment blocks
        callback(null, true);
      }
    },
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
app.use("/api/payments", paymentRoutes);
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

// ⭐ Interaction Tracking Routes (for rule-based recommendations)
import interactionRoutes from "./routes/interactionRoutes";
app.use("/api/interactions", interactionRoutes);

import placePhotoRoutes from "./routes/placePhotoRoutes";
app.use("/api/place-photos", placePhotoRoutes);

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error("🔥 Server Error:", err.stack);
  res.status(500).json({ message: "Server error", error: err.message });
});

// ── Cron: Auto-expire events every hour ───────────────────────
import { processDueReminders } from './controllers/eventReminderController';

function startCronJobs() {
  // Run auto-expire every hour
  setInterval(async () => {
    try {
      const now = new Date();
      const Event = (await import('./models/Event')).default;
      await Event.updateMany(
        { startDate: { $lte: now }, endDate: { $gte: now }, eventStatus: { $ne: 'cancelled' } },
        { $set: { eventStatus: 'ongoing' } }
      );
      await Event.updateMany(
        { endDate: { $lt: now }, eventStatus: { $nin: ['cancelled', 'completed'] } },
        { $set: { eventStatus: 'completed' } }
      );
      console.log('[Cron] Auto-expired events updated');
    } catch (e) {
      console.error('[Cron] Auto-expire error:', e);
    }
  }, 60 * 60 * 1000); // every hour

  // Run reminder processing every 15 minutes
  setInterval(async () => {
    try {
      await processDueReminders();
    } catch (e) {
      console.error('[Cron] Reminder processing error:', e);
    }
  }, 15 * 60 * 1000); // every 15 minutes

  console.log('⏰ Cron jobs started: auto-expire (1h), reminders (15min)');
}

// Handle unhandled promise rejections
process.on("unhandledRejection", (err: any) => {
  console.error("🔥 Unhandled Rejection:", err.message);
  // In dev, we might not want to exit, but it helps identify the cause
  // process.exit(1);
});

// Handle uncaught exceptions
process.on("uncaughtException", (err: any) => {
  console.error("🔥 Uncaught Exception:", err.message);
  process.exit(1);
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);

  try {
    console.log("⏳ Connecting to MongoDB...");
    await connectDB();
    console.log("✅ MongoDB Connected");

    // Seed Stays if needed
    console.log("⏳ Checking if Stays need seeding...");
    await seedStays();

    // Migrate old data
    console.log("⏳ Checking if Stays need migration...");
    await migrateStays();

    // Start background cron jobs
    console.log("⏳ Starting cron jobs...");
    startCronJobs();
    console.log("✨ All startup tasks complete");

  } catch (err: any) {
    console.error("❌ Critical Startup Error:", err.message);
    if (err.stack) console.error(err.stack);
  }
});
