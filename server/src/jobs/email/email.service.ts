import { render } from '@react-email/components';
import { createElement } from 'react';
import transporter from '@/config/mailer';
import { WelcomeEmail } from './templates/WelcomeEmail';
import type { EmailJobData } from './email.types';
import { env } from '@/config/env';
import { htmlToText } from 'html-to-text';

const FROM = env.EMAIL_FROM;

export const EmailService = {
  async sendWelcome(to: string, name: string): Promise<void> {
    const html = await render(createElement(WelcomeEmail, { name }));
    await transporter.sendMail({
      from: FROM,
      to,
      subject: 'Welcome to MyStore!',
      html,
      text: htmlToText(html),
    });
  },

  async sendPasswordReset(to: string, resetLink: string): Promise<void> {
    // TODO: import PasswordResetEmail once template is created
    await transporter.sendMail({ from: FROM, to, subject: 'Reset your password', text: resetLink });
  },

  async dispatch(job: EmailJobData): Promise<void> {
    switch (job.type) {
      case 'welcome':
        await this.sendWelcome(job.to, job.name);
        break;
      case 'password-reset':
        await this.sendPasswordReset(job.to, job.resetLink);
        break;
      default:
        throw new Error(`Unhandled email job type: ${job.type}`);
    }
  },
};
