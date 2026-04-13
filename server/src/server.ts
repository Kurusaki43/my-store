import { connectToDatabase } from "@/config/db";
import { env } from "@/config/env";
import { logger } from "@/config/logger";
import app from "./app";

connectToDatabase().then(() => {
  app.listen(env.PORT, () =>
    logger.info(`Server running on port ${env.PORT} [${env.NODE_ENV}]`),
  );
});
