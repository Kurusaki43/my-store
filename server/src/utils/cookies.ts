import { env } from '@/config/env';
import type { CookieOptions, Response } from 'express';

export const MAX_COOKIE_AGE = 7 * 24 * 60 * 60 * 1000;
export const REFRESH_TOKEN_COOKIE_NAME = 'refreshToken';
export const SESSION_ID_COOKIE_NAME = 'sessionId';

const cookiesOptions: CookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === 'development' ? false : true,
  sameSite: 'strict',
  path: '/',
};

const refreshTokenCookieOptions: CookieOptions = {
  ...cookiesOptions,
  maxAge: MAX_COOKIE_AGE,
};

export const setCookies = (res: Response, token: string, sessionId: string): Response => {
  return res
    .cookie(REFRESH_TOKEN_COOKIE_NAME, token, refreshTokenCookieOptions)
    .cookie(SESSION_ID_COOKIE_NAME, sessionId, refreshTokenCookieOptions);
};

export const clearCookies = (res: Response): Response => {
  return res
    .clearCookie(REFRESH_TOKEN_COOKIE_NAME, cookiesOptions)
    .clearCookie(SESSION_ID_COOKIE_NAME, cookiesOptions);
};
