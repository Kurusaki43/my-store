import { asyncHandler } from '@/utils/asyncHandler';
import { extractDeviceInfo } from '@/utils/helpers';
import type { LoginDTO, RegisterDTO } from './auth.validation';
import { AuthService } from './auth.service';
import { setCookies } from '@/utils/cookies';
import { sendSuccess } from '@/utils/response';
import { HTTP_STATUS } from '@/constants/httpStatus';

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
      msg: 'Registration successful',
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
      msg: 'Login successful',
      data: { user, accessToken },
    });
  }),
};
