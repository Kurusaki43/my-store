import mongoose from "mongoose";
import { env } from "./env";

export const connectToDatabase = async () => {
  try {
    await mongoose.connect(env.MONGO_URI);
    console.log("Connected to MongoDB successfully");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  }
};
