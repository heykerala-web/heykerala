import mongoose, { Document, Schema } from 'mongoose';

export interface IStay extends Document {
    name: string;
    type: 'hotel' | 'resort' | 'homestay' | 'restaurant' | 'cafe';
    description: string;
    district: string;
    latitude?: number;
    longitude?: number;
    images: string[];
    price: number;
    amenities: string[];
    ratingAvg: number;
    status: 'pending' | 'approved' | 'rejected';
    createdBy?: string;
    createdAt: Date;
}

const StaySchema: Schema = new Schema({
    name: { type: String, required: true },
    type: {
        type: String,
        enum: ['hotel', 'resort', 'homestay', 'restaurant', 'cafe'],
        required: true
    },
    description: { type: String, required: true },
    district: { type: String, required: true },
    latitude: { type: Number },
    longitude: { type: Number },
    images: [{ type: String }],
    price: { type: Number, required: true },
    amenities: [{ type: String }],
    ratingAvg: { type: Number, default: 0 },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Stay || mongoose.model<IStay>('Stay', StaySchema);
