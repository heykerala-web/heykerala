import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email?: string;
  password?: string;
  avatar?: string | null;
  bio?: string;
  savedPlaces: mongoose.Types.ObjectId[];
  savedStays: mongoose.Types.ObjectId[];
  savedEvents: mongoose.Types.ObjectId[];
  provider: string;
  googleId?: string;
  facebookId?: string;
  role: "Admin" | "Tourist" | "Contributor";
  phone?: string;
  location?: string;
  travelBadge?: string;
  persona?: string;
  travelInterests?: string[];
  contributionCount?: number;
  savedCount?: number;
  bookingCount?: number;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
}

const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    name: { type: String, required: true },

    // FIX: optional email + sparse unique index
    email: {
      type: String,
      unique: true,
      sparse: true, // <--- IMPORTANT!!!
    },

    role: {
      type: String,
      enum: ["Admin", "Tourist", "Contributor"],
      default: "Tourist",
    },

    password: { type: String },

    avatar: { type: String, default: null },

    bio: { type: String, default: "" },

    savedPlaces: [{ type: mongoose.Schema.Types.ObjectId, ref: "Place" }],
    savedStays: [{ type: mongoose.Schema.Types.ObjectId, ref: "Stay" }],
    savedEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],

    provider: { type: String, default: "local" },

    googleId: { type: String },
    facebookId: { type: String },

    phone: { type: String, default: "" },
    location: { type: String, default: "" },
    travelBadge: { type: String, default: "Explorer 🌍" },
    persona: { type: String, default: "New Traveler" },
    travelInterests: [{ type: String }],
    contributionCount: { type: Number, default: 0 },
    savedCount: { type: Number, default: 0 },
    bookingCount: { type: Number, default: 0 },
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", userSchema);
