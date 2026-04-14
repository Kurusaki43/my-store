import { AppError } from '@/utils/AppError';
import { User } from '../user/user.model';
import type { RegisterDTO } from './auth.validation';
import { HTTP_STATUS, SESSION_TTL_DAYS } from '@/constants/httpStatus';
import { generateRefreshToken, hashRefreshToken, signAccessToken } from '@/utils/jwt';
import { Session } from './auth.model';
import { expireAfterDays } from '@/utils/helpers';

export const AuthService = {
  async register(userData: RegisterDTO, ip: string, userAgent: string) {
    const existingUser = await User.exists({ email: userData.email });
    if (existingUser) {
      throw new AppError('User with this email already exists', HTTP_STATUS.CONFLICT);
    }

    const user = await User.create(userData);

    const refreshToken = generateRefreshToken();
    const session = await Session.create({
      user: user._id,
      refreshTokenHash: hashRefreshToken(refreshToken),
      ip,
      userAgent,
      expiresAt: expireAfterDays(SESSION_TTL_DAYS),
    });

    const accessToken = signAccessToken({
      userId: user._id,
      sessionId: session._id,
    });

    return { user, accessToken, refreshToken, sessionId: session._id.toString() };
  },
};
