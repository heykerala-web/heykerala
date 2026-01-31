import mongoose from "mongoose";
const bookingSchema = new mongoose.Schema({
    // Existing fields (kept for compatibility or different modules)
    name: String,
    phone: String,
    email: String,
    packageId: { type: mongoose.Schema.Types.ObjectId, ref: "Package" },
    date: Date,

    // New Stay Booking fields
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    stayId: { type: mongoose.Schema.Types.ObjectId, ref: "Stay" },
    roomType: String,
    checkIn: Date,
    checkOut: Date,
    guests: {
        adults: { type: Number, default: 1 },
        children: { type: Number, default: 0 }
    },
    status: {
        type: String,
        enum: ["pending", "confirmed", "rejected"],
        default: "pending"
    },

    createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Booking || mongoose.model("Booking", bookingSchema);