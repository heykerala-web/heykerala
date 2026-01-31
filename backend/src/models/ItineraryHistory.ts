import mongoose from "mongoose";

const itinerarySchema = new mongoose.Schema({
    method: { type: String, enum: ["manual", "ai"], default: "manual" },
    duration: String,
    budget: String,
    interests: [String],
    travelers: String,
    plan: [{ day: Number, place: String, activities: [String], map: String }],
    estimatedCost: Number,
    rawAI: String, // stores raw AI text if method === 'ai'
    itineraryData: { type: mongoose.Schema.Types.Mixed }, // Store full itinerary JSON
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.ItineraryHistory ||
    mongoose.model("ItineraryHistory", itinerarySchema);