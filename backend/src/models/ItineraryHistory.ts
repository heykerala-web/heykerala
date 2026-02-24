import mongoose from "mongoose";

const itinerarySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    packageId: { type: mongoose.Schema.Types.ObjectId, ref: "Package" },
    method: { type: String, enum: ["manual", "ai"], default: "manual" },
    duration: String,
    budget: String,
    interests: [String],
    travelers: String,
    plan: [{ day: Number, place: String, activities: [String], map: String }],
    estimatedCost: Number,
    rawAI: String, // stores raw AI text if method === 'ai'
    itineraryData: { type: mongoose.Schema.Types.Mixed }, // Store full itinerary JSON
}, { timestamps: true });

export default mongoose.models.ItineraryHistory ||
    mongoose.model("ItineraryHistory", itinerarySchema);