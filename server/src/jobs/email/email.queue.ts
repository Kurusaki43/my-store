import { Queue } from 'bullmq';
import { redisConnection } from '@/config/queue';
import type { EmailJobData } from './email.types';

export const emailQueue = new Queue<EmailJobData>('email', {
  connection: redisConnection,
  defaultJobOptions: { attempts: 3, backoff: { type: 'exponential', delay: 5000 } },
});
