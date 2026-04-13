import mongoose from "mongoose";
import { env } from "./env";
import { logger } from "./logger";

export const connectToDatabase = async () => {
  try {
    await mongoose.connect(env.MONGO_URI);
    logger.info("Connected to MongoDB successfully");
  } catch (err) {
    logger.error("Error connecting to MongoDB:", err);
    process.exit(1);
  }
};
