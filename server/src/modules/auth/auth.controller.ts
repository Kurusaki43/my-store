import { type RequestHandler } from 'express';
import { extractDeviceInfo } from '@/utils/helpers';
import type {
  ForgotPasswordDTO,
  LoginDTO,
  RegisterDTO,
  ResetPasswordDTO,
  ResetPasswordParamsDTO,
} from './auth.validation';
import { AuthService } from './auth.service';
import {
  clearCookies,
  getCookie,
  REFRESH_TOKEN_COOKIE_NAME,
  SESSION_ID_COOKIE_NAME,
  setCookies,
} from '@/utils/cookies';
import { sendSuccess } from '@/utils/response';
import { HTTP_STATUS } from '@/constants/httpStatus';
import { AppError } from '@/utils/AppError';

export const AuthController: Record<string, RequestHandler> = {
  register: async (req, res) => {
    const userData = req.body as RegisterDTO;

    const { ip, userAgent } = extractDeviceInfo(req);

    const { user, accessToken, refreshToken, sessionId } = await AuthService.register(
      userData,
      ip,
      userAgent,
    );

    const resWithCookies = setCookies(res, refreshToken, sessionId);

    sendSuccess({
      res: resWithCookies,
      statusCode: HTTP_STATUS.CREATED,
      message: 'Registration successful',
      data: { user, accessToken },
    });
  },

  login: async (req, res) => {
    const loginData = req.body as LoginDTO;

    const { ip, userAgent } = extractDeviceInfo(req);

    const { user, accessToken, refreshToken, sessionId } = await AuthService.login(
      loginData,
      ip,
      userAgent,
    );

    const resWithCookies = setCookies(res, refreshToken, sessionId);

    sendSuccess({
      res: resWithCookies,
      statusCode: HTTP_STATUS.OK,
      message: 'Login successful',
      data: { user, accessToken },
    });
  },

  logout: async (req, res) => {
    const sessionId = getCookie(req, SESSION_ID_COOKIE_NAME);
    if (!sessionId) {
      throw new AppError('No active session found', HTTP_STATUS.BAD_REQUEST);
    }
    await AuthService.logout(sessionId);
    clearCookies(res);
    sendSuccess({
      res,
      statusCode: HTTP_STATUS.OK,
      message: 'Logout successful',
    });
  },

  refresh: async (req, res) => {
    const sessionId = getCookie(req, SESSION_ID_COOKIE_NAME);
    const refreshToken = getCookie(req, REFRESH_TOKEN_COOKIE_NAME);
    if (!sessionId || !refreshToken) {
      throw new AppError('Unauthorized', HTTP_STATUS.UNAUTHORIZED);
    }

    const { newAccessToken, newRefreshToken } = await AuthService.refresh(refreshToken, sessionId);
    const resWithCookies = setCookies(res, newRefreshToken, sessionId);

    sendSuccess({
      res: resWithCookies,
      statusCode: HTTP_STATUS.OK,
      message: 'Access token refreshed successfully',
      data: { accessToken: newAccessToken },
    });
  },

  forgotPassword: async (req, res) => {
    const { email } = req.body as ForgotPasswordDTO;
    await AuthService.forgotPassword(email);
    sendSuccess({ res, statusCode: HTTP_STATUS.OK, message: 'Email sent successfully' });
  },

  resetPassword: async (req, res) => {
    const { token } = req.params as ResetPasswordParamsDTO;
    const { newPassword } = req.body as ResetPasswordDTO;
    await AuthService.resetPassword(token, newPassword);
    sendSuccess({ res, statusCode: HTTP_STATUS.OK, message: 'Password was reset successfully' });
  },

  getSessions: async (req, res) => {
    const sessions = await AuthService.getSessions(req.userId!);
    sendSuccess({ res, statusCode: HTTP_STATUS.OK, message: 'Sessions found', data: { sessions } });
  },

  deleteAllSessions: async (req, res) => {
    await AuthService.deleteAllSessions(req.userId!);
    clearCookies(res);
    sendSuccess({
      res,
      statusCode: HTTP_STATUS.OK,
      message: 'All sessions deleted successfully',
    });
  },

  deleteSession: async (req, res) => {
    await AuthService.deleteSession(req.params.sessionId as string, req.userId!);
    sendSuccess({ res, statusCode: HTTP_STATUS.OK, message: 'Session deleted successfully' });
  },
};
