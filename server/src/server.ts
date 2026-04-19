import { connectToDatabase } from '@/config/db';
import { env } from '@/config/env';
import { logger } from '@/config/logger';
import '@/jobs/email/email.worker';
import app from './app';

void connectToDatabase().then(() => {
  app.listen(env.PORT, () =>
    logger.info(`Server running on port ${env.PORT.toString()} [${env.NODE_ENV}]`),
  );
});
