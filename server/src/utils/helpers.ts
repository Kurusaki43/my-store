import type { Request } from 'express';

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
