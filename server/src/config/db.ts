import mongoose from "mongoose";
import { env } from "./env";
import { logger } from "./logger";

export const connectToDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(env.MONGO_URI);
    logger.info("Connected to MongoDB successfully");
  } catch (err) {
    logger.error("Error connecting to MongoDB:", err);
    throw new Error("Failed to connect to MongoDB");
  }
};
