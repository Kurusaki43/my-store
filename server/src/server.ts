import { connectToDatabase } from '@/config/db';
import { env } from '@/config/env';
import { logger } from '@/config/logger';
import app from './app';
import './jobs/email/email.worker';

void connectToDatabase().then(() => {
  app.listen(env.PORT, () =>
    logger.info(`Server running on port ${env.PORT.toString()} [${env.NODE_ENV}]`),
  );
});
