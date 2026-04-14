import crypto from 'crypto';
import type { JwtPayload } from 'jsonwebtoken';
import jwt from 'jsonwebtoken';

import { env } from '@/config/env';
import { AppError } from './AppError';
import { HTTP_STATUS } from '@/constants/httpStatus';
import type { IUser } from '@/modules/user/user.types';
import type { ISession } from '@/modules/auth/auth.types';

export const ACCESS_TOKEN_EXPIRATION = '15m';

export interface Payload extends JwtPayload {
  userId: IUser['_id'];
  sessionId: ISession['_id'];
}
export const signAccessToken = (payload: Payload): string =>
  jwt.sign(payload, env.JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRATION });

export const generateRefreshToken = (): string => crypto.randomBytes(64).toString('hex');

export const hashRefreshToken = (refreshToken: string): string =>
  crypto.createHash('sha256').update(refreshToken).digest('hex');

export const verifyToken = (token: string): Payload | never => {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as Payload;
    return decoded;
  } catch {
    throw new AppError('Invalid or expired access token', HTTP_STATUS.UNAUTHORIZED);
  }
};
