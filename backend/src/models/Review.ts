import mongoose, { Schema, Document } from "mongoose";

export interface IReview extends Document {
    user: mongoose.Types.ObjectId;
    place: mongoose.Types.ObjectId;
    rating: number;
    comment: string;
    createdAt: Date;
}

const reviewSchema = new Schema<IReview>(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        place: { type: mongoose.Schema.Types.ObjectId, ref: "Place", required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String, required: true, trim: true },
    },
    { timestamps: true }
);

// Prevent duplicate reviews from same user for same place
reviewSchema.index({ user: 1, place: 1 }, { unique: true });

export default mongoose.model<IReview>("Review", reviewSchema);
