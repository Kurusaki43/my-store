import { env } from '@/config/env';
import type { CookieOptions, Request, Response } from 'express';

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

type CookieKey = typeof REFRESH_TOKEN_COOKIE_NAME | typeof SESSION_ID_COOKIE_NAME;

export const getCookie = (req: Request, key: CookieKey): string | undefined => {
  const cookies = req.cookies as Partial<Record<CookieKey, unknown>>;
  // eslint-disable-next-line security/detect-object-injection
  const value = cookies[key];
  return typeof value === 'string' ? value : undefined;
};

export const clearCookies = (res: Response): Response => {
  return res
    .clearCookie(REFRESH_TOKEN_COOKIE_NAME, cookiesOptions)
    .clearCookie(SESSION_ID_COOKIE_NAME, cookiesOptions);
};
