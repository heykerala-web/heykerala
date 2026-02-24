import mongoose from "mongoose";
const packageSchema = new mongoose.Schema({
    destinationId: { type: mongoose.Schema.Types.ObjectId, ref: "Destination" },
    stays: [{ type: mongoose.Schema.Types.ObjectId, ref: "Stay" }],
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