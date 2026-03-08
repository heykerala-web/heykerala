import mongoose, { Schema, Document } from "mongoose";

export interface IReview extends Document {
    user: mongoose.Types.ObjectId;
    targetId: mongoose.Types.ObjectId;
    targetType: "place" | "stay" | "event" | "app";
    rating: number;
    title?: string;
    comment: string;
    createdAt: Date;
    updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        targetId: { type: mongoose.Schema.Types.ObjectId, required: true },
        targetType: {
            type: String,
            required: true,
            enum: ["place", "stay", "event", "app"]
        },
        rating: { type: Number, required: true, min: 1, max: 5 },
        title: { type: String, trim: true },
        comment: { type: String, required: true, trim: true },
    },
    { timestamps: true }
);

// Prevent duplicate reviews from same user for same target
reviewSchema.index({ user: 1, targetId: 1, targetType: 1 }, { unique: true });

export default mongoose.model<IReview>("Review", reviewSchema);
