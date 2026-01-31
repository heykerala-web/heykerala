import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email?: string;
  password?: string;
  avatar?: string | null;
  bio?: string;
  savedPlaces: mongoose.Types.ObjectId[];
  provider: string;
  googleId?: string;
  facebookId?: string;
  role: "Admin" | "Tourist" | "Contributor";
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

    provider: { type: String, default: "local" },

    googleId: { type: String },
    facebookId: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", userSchema);
