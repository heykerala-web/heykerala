import mongoose, { Document, Schema } from 'mongoose';

export interface IEvent extends Document {
    title: string;
    description: string;
    category: string;
    district: string;
    venue: string;
    startDate: Date;
    endDate: Date;
    time: string;
    images: string[];
    latitude?: number;
    longitude?: number;
    ratingAvg?: number;
    ratingCount?: number;
    status: 'pending' | 'approved' | 'rejected';
    createdBy?: string;
    createdAt: Date;
}

const EventSchema: Schema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true }, // Festival, Cultural, Music, etc.
    district: { type: String, required: true },
    venue: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    time: { type: String }, // e.g., "10:00 AM" or "All Day"
    images: [{ type: String }],
    latitude: { type: Number },
    longitude: { type: Number },
    ratingAvg: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);
