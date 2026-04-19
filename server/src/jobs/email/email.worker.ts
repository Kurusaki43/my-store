import { Worker } from 'bullmq';
import { redisConnection } from '@/config/queue';
import { logger } from '@/config/logger';
import type { EmailJobData } from './email.types';
import { EmailService } from './email.service';

export const emailWorker = new Worker<EmailJobData>(
  'email',

  (job) => EmailService.dispatch(job.data),
  { connection: redisConnection },
);

emailWorker.on('completed', (job) => {
  logger.info('Email job completed', { jobId: job.id, type: job.data.type });
});

emailWorker.on('failed', (job, error) => {
  logger.error('Email job failed', { jobId: job?.id, type: job?.data.type, error: error.message });
});

emailWorker.on('error', (error) => {
  logger.error('Email worker error', { error: error.message });
});
