import mongoose from "mongoose";
import { env } from "./env.config";

export const connectDB = async (): Promise<void> => {
  try {
    const mongoUri =
      env.DATABASE_URL || "mongodb://localhost:27017/resource-booking";
    await mongoose.connect(mongoUri);
    console.log("MongoDB Connected Successfully!");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};
