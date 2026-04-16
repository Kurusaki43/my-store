import { asyncHandler } from '@/utils/asyncHandler';
import { extractDeviceInfo } from '@/utils/helpers';
import type { LoginDTO, RegisterDTO } from './auth.validation';
import { AuthService } from './auth.service';
import { clearCookies, getCookie, SESSION_ID_COOKIE_NAME, setCookies } from '@/utils/cookies';
import { sendSuccess } from '@/utils/response';
import { HTTP_STATUS } from '@/constants/httpStatus';
import { AppError } from '@/utils/AppError';

export const AuthController = {
  register: asyncHandler(async (req, res) => {
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
  }),
  login: asyncHandler(async (req, res) => {
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
  }),
  logout: asyncHandler(async (req, res) => {
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
  }),
};
