 import mongoose from "mongoose";
 const packageSchema = new mongoose.Schema({
title: String,
 duration: String,
 price: Number,
 originalPrice: Number,
 rating: Number,
 reviews: Number,
 image: String,
 highlights: [String],
 includes: [String],
 badge: String
 });
 export default mongoose.models.Package || mongoose.model("Package",
 packageSchema);