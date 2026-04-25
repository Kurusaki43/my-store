import { config } from 'dotenv';
import z from 'zod';

config({ path: `.env.${process.env.NODE_ENV ?? 'development'}`, override: false });

const schema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(5000),
  MONGO_URI: z.string({
    error:
      'MONGO_URI is required — provide a valid MongoDB connection string (e.g. mongodb://localhost:27017/mydb)',
  }),
  JWT_SECRET: z
    .string({ error: 'JWT_SECRET is required' })
    .min(32, 'JWT_SECRET must be at least 32 characters to be secure'),
  CLIENT_URL: z.url('CLIENT_URL must be a valid URL (e.g. http://localhost:3000)'),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  MAIL_HOST: z.string({
    error: 'MAIL_HOST is required — provide your SMTP hostname (e.g. smtp.gmail.com)',
  }),
  MAIL_PORT: z.coerce
    .number({ error: 'MAIL_PORT is required — provide your SMTP port (e.g. 465, 587)' })
    .int()
    .positive(),
  MAIL_USER: z.string({ error: 'MAIL_USER is required — provide your SMTP email address' }),
  MAIL_PASS: z.string({
    error: 'MAIL_PASS is required — provide your SMTP password or app password',
  }),
  EMAIL_FROM: z.string({ error: 'EMAIL_FROM is required (e.g. "MyStore" <no-reply@mystore.com>)' }),
  REDIS_URL: z.url('REDIS_URL must be a valid URL (e.g. redis://localhost:6379)'),
  GOOGLE_CLIENT_ID: z.string({
    error: 'GOOGLE_CLIENT_ID is required - provide your id',
  }),
});

const result = schema.safeParse(process.env);
if (!result.success) {
  console.error('\n❌ Server failed to start due to invalid environment variables:\n');
  result.error.issues.forEach((issue) => {
    console.error(`  [${issue.path.join('.')}] ${issue.message}`);
  });
  console.error('\nFix the above variables in your .env file and restart.\n');
  throw new Error('invalid environment variables');
}

export const env = result.data;
