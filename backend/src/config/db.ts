import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    // Try to connect
    const conn = await mongoose.connect(process.env.MONGO_URI as string);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err: any) {
    console.error(" MongoDB Connection Failed:", err.message);
    throw err; // Re-throw so caller can handle
  }
};

export default connectDB;
