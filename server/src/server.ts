import { connectToDatabase } from "@/config/db";
import { env } from "@/config/env";
import app from "./app";

connectToDatabase().then(() => {
  app.listen(env.PORT, () => console.log(`Server running on port ${env.PORT} [${env.NODE_ENV}]`));
});
