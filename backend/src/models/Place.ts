import mongoose from "mongoose";

const nearbyAttractionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String },
  distance: { type: String }, // e.g., "5 km away"
});

const placeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    district: { type: String, required: true },
    category: { type: String, required: true }, // Hill Station, Beach, Backwaters, Wildlife, etc.
    description: { type: String, required: true },
    image: { type: String }, // Main image (kept for backward compatibility or easy access)
    images: [{ type: String }], // Array of image URLs
    location: { type: String, required: true }, // Short location string
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    tags: [{ type: String }],
    nearby: [nearbyAttractionSchema],
    ratingAvg: { type: Number, default: 0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 }, // Keeping for backward compatibility
    highlights: [{ type: String }],
    bestTimeToVisit: { type: String },
    entryFee: { type: String },
    openingHours: { type: String },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);



export default mongoose.models.Place || mongoose.model("Place", placeSchema);






