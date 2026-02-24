import mongoose, { Schema, Document } from "mongoose";

export interface IPlacePhoto extends Document {
    place?: mongoose.Types.ObjectId;
    event?: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    image: string;
    caption?: string;
    targetType: "place" | "event";
    status: "approved" | "pending" | "rejected";
    createdAt: Date;
}

const placePhotoSchema = new Schema<IPlacePhoto>(
    {
        place: { type: mongoose.Schema.Types.ObjectId, ref: "Place" },
        event: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        image: { type: String, required: true },
        caption: { type: String, trim: true },
        targetType: {
            type: String,
            enum: ["place", "event"],
            required: true,
            default: "place"
        },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },
    },
    { timestamps: true }
);

export default mongoose.model<IPlacePhoto>("PlacePhoto", placePhotoSchema);
