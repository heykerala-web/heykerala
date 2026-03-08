import mongoose, { Document, Schema } from 'mongoose';

export interface IRoomType {
    name: string;
    description?: string;
    basePrice: number;
    capacity: number;
    amenities: string[];
    count: number; // For availability checking
}

export interface IStay extends Document {
    name: string;
    type: 'hotel' | 'resort' | 'homestay' | 'restaurant' | 'cafe';
    description: string;
    district: string;
    latitude?: number;
    longitude?: number;
    images: string[];
    image?: string;
    price: number; // Base or starting price
    roomTypes?: IRoomType[];
    minStay?: number;
    amenities: string[];
    ratingAvg: number;
    ratingCount: number;
    status: 'pending' | 'approved' | 'rejected';
    createdBy?: string;
    // For Restaurants/Cafes
    openingTime?: string; // HH:MM
    closingTime?: string; // HH:MM
    avgDuration?: number; // In minutes
    totalCapacity?: number;
    createdAt: Date;
    updatedAt: Date;
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
    image: { type: String },
    price: { type: Number, required: true },
    roomTypes: [{
        name: { type: String },
        description: { type: String },
        basePrice: { type: Number },
        capacity: { type: Number },
        amenities: [{ type: String }],
        count: { type: Number, default: 1 }
    }],
    minStay: { type: Number, default: 1 },
    amenities: [{ type: String }],
    ratingAvg: { type: Number, default: 5.0 },
    ratingCount: { type: Number, default: 0 },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    openingTime: { type: String },
    closingTime: { type: String },
    avgDuration: { type: Number, default: 60 },
    totalCapacity: { type: Number },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

// Pre-save hook to sync image with the first element of images array
StaySchema.pre('save', function (this: IStay, next) {
    if ((!this.image || this.image === '') && this.images && this.images.length > 0) {
        this.image = this.images[0];
    }
    next();
});

export default mongoose.models.Stay || mongoose.model<IStay>('Stay', StaySchema);
