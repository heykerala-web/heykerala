import mongoose from "mongoose";
const bookingSchema = new mongoose.Schema({
    // General / Package Booking (Legacy/Other)
    name: String,
    phone: String,
    email: String,
    packageId: { type: mongoose.Schema.Types.ObjectId, ref: "Package" },
    date: Date,

    // Common fields
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: {
        type: String,
        enum: ["pending", "confirmed", "rejected", "cancelled", "completed"],
        default: "pending"
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending"
    },
    totalPrice: { type: Number },

    // Stay Booking fields
    stayId: { type: mongoose.Schema.Types.ObjectId, ref: "Stay" },
    roomType: String,
    checkIn: Date,
    checkOut: Date,
    guests: {
        adults: { type: Number, default: 1 },
        children: { type: Number, default: 0 }
    },

    // Restaurant/Cafe Booking fields
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "Stay" }, // Using Stay model for restaurants
    bookingDate: Date,
    bookingTime: String,
    numberOfGuests: Number,
    tableType: String,

    // Razorpay Fields
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,

    // PayPal Fields
    paypalOrderId: String,
    paypalPaymentId: String,

    // Manual Payment Fields
    paymentMethod: {
        type: String,
        enum: ["razorpay", "manual_upi", "paypal"],
        default: "razorpay"
    },
    bookingId: { type: String, unique: true },
    manualPaymentRef: String, // Transaction ID from user
    manualPaymentStatus: {
        type: String,
        enum: ["none", "pending_verification", "verified", "rejected"],
        default: "none"
    }

}, { timestamps: true });

export default mongoose.models.Booking || mongoose.model("Booking", bookingSchema);