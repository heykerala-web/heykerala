 import mongoose from "mongoose";
 const destinationSchema = new mongoose.Schema({
 name: { type: String, required: true },
 type: [{ type: String }], // e.g. ["Hills","Backwaters","Culture"]
 activities: [{ type: String }],
 idealFor: [{ type: String }], // ["Couple","Family","Solo"]
 budgetLevel: { type: String, enum: ["Budget","Mid-range","Luxury"], default:
 "Mid-range" },
 locationLink: { type: String }
 });
 export default mongoose.models.Destination || mongoose.model("Destination",
 destinationSchema);