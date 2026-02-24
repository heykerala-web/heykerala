import mongoose, { Document, Schema } from "mongoose";

export interface IAIRecommendCache extends Document {
    category: string;
    result: any; // Can be a string or JSON object depending on how we store it
    createdAt: Date;
}

const AIRecommendCacheSchema: Schema = new Schema(
    {
        category: {
            type: String,
            required: true,
            unique: true, // We only want one cache entry per category
            trim: true,
            lowercase: true,
        },
        result: {
            type: Schema.Types.Mixed, // Storing flexible result types
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            expires: 86400, // Expires after 24 hours (86400 seconds)
        },
    },
    { timestamps: true }
);

export default mongoose.model<IAIRecommendCache>("AIRecommendCacheV3", AIRecommendCacheSchema);
