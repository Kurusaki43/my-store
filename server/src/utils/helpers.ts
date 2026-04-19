import type { Request } from 'express';
import crypto from 'crypto';
interface DeviceInfo {
  ip: string;
  userAgent: string;
}

export const extractDeviceInfo = (req: Request): DeviceInfo => {
  const ip = req.ip ?? req.headers['x-forwarded-for']?.toString().split(',')[0] ?? 'Unknown';
  const userAgent = req.get('User-Agent') ?? 'Unknown';
  return { ip, userAgent };
};

export const expireAfterDays = (days: number): Date => {
  const now = new Date();
  return new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
};

export const generateCode = (): string => crypto.randomBytes(16).toString('hex');

export const hashCode = (val: string): string =>
  crypto.createHash('sha256').update(val).digest('hex');

export const compareCode = (storedCode: string, sendedCode: string): boolean =>
  crypto.timingSafeEqual(Buffer.from(storedCode), Buffer.from(sendedCode));
