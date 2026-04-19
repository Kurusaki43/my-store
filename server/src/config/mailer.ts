import nodemailer from 'nodemailer';
import { env } from './env';
import { logger } from './logger';

const transporter = nodemailer.createTransport({
  host: env.MAIL_HOST,
  port: env.MAIL_PORT,
  auth: {
    user: env.MAIL_USER,
    pass: env.MAIL_PASS,
  },
});

transporter.verify((error) => {
  if (error) {
    logger.error('Mailer connection failed', { error });
  } else {
    logger.info('Mailer ready');
  }
});

export default transporter;
