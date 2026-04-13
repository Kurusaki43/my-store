import { config } from "dotenv";
import z from "zod";
config({ path: `.env.${process.env.NODE_ENV ?? "development"}` });

const schema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.string().default("5000"),
  MONGO_URI: z.string().default("mongodb://localhost:27017/my-store"),
  JWT_SECRET: z.string().default("your_jwt_secret"),
  CLIENT_URL: z.string().default("http://localhost:5173"),
  LOG_LEVEL: z.enum(["error", "warn", "info", "debug"]).default("info"),
});

export const env = schema.parse(process.env);
