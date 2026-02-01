import mongoose, { Schema, Document } from "mongoose";

export interface IPlacePhoto extends Document {
    place: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    image: string;
    caption?: string;
    status: "pending" | "approved" | "rejected";
    createdAt: Date;
}

const placePhotoSchema = new Schema<IPlacePhoto>(
    {
        place: { type: mongoose.Schema.Types.ObjectId, ref: "Place", required: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        image: { type: String, required: true },
        caption: { type: String, trim: true },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },
    },
    { timestamps: true }
);

export default mongoose.model<IPlacePhoto>("PlacePhoto", placePhotoSchema);
