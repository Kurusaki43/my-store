import { AppError } from '@/utils/AppError';
import { User } from '../user/user.model';
import type { LoginDTO, RegisterDTO } from './auth.validation';
import { HTTP_STATUS, SESSION_TTL_DAYS } from '@/constants/httpStatus';
import {
  generateRefreshToken,
  hashRefreshToken,
  signAccessToken,
  verifyRefreshToken,
} from '@/utils/jwt';
import { Session, VerificationCode } from './auth.model';
import { expireAfterDays, generateCode, hashCode } from '@/utils/helpers';
import { SESSION_REVOCATION_REASONS } from './auth.types';
import { emailQueue } from '@/jobs/email/email.queue';
import { env } from '@/config/env';

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
      role: user.role,
    });

    await emailQueue.add('welcome', { type: 'welcome', to: user.email, name: user.name });
    return { user, accessToken, refreshToken, sessionId: session._id.toString() };
  },

  async login(loginData: LoginDTO, ip: string, userAgent: string) {
    const user = await User.findOne({ email: loginData.email }).select('+password');
    if (!user) {
      throw new AppError('Invalid email or password', HTTP_STATUS.UNAUTHORIZED);
    }

    const isMatch = await user.comparePassword(loginData.password);
    if (!isMatch) {
      throw new AppError('Invalid email or password', HTTP_STATUS.UNAUTHORIZED);
    }

    const refreshToken = generateRefreshToken();
    const session = await Session.create({
      user: user._id,
      refreshTokenHash: hashRefreshToken(refreshToken),
      ip,
      userAgent,
      expiresAt: expireAfterDays(7),
    });
    const accessToken = signAccessToken({
      userId: user._id,
      sessionId: session._id,
      role: user.role,
    });

    return { user, accessToken, refreshToken, sessionId: session._id.toString() };
  },
  async logout(sessionId: string) {
    await Session.updateOne(
      { _id: sessionId },
      {
        isValid: false,
        revokedReason: SESSION_REVOCATION_REASONS.USER_LOGOUT,
        revokedAt: new Date(),
      },
    );
  },
  async refresh(refreshToken: string, sessionId: string) {
    const session = await Session.findById(sessionId);

    if (!session) {
      throw new AppError('No session found', HTTP_STATUS.UNAUTHORIZED);
    }

    if (!session.isValid || session.revokedAt || session.revokedReason) {
      throw new AppError('Session revoked', HTTP_STATUS.UNAUTHORIZED);
    }

    if (session.expiresAt < new Date()) {
      throw new AppError('Session expired', HTTP_STATUS.UNAUTHORIZED);
    }

    const isMatch = verifyRefreshToken(session.refreshTokenHash, refreshToken);

    if (!isMatch) {
      session.isValid = false;
      session.revokedAt = new Date();
      session.revokedReason = SESSION_REVOCATION_REASONS.SECURITY_ISSUE;
      session.lastUsedAt = new Date();

      await session.save();

      throw new AppError('Refresh token reuse detected', HTTP_STATUS.UNAUTHORIZED);
    }

    const user = await User.findById(session.user);

    if (!user) {
      throw new AppError('No user attached to this session', HTTP_STATUS.UNAUTHORIZED);
    }

    const newRefreshToken = generateRefreshToken();
    const newAccessToken = signAccessToken({
      userId: user._id,
      sessionId: session._id,
      role: user.role,
    });

    session.refreshTokenHash = hashRefreshToken(newRefreshToken);
    session.lastUsedAt = new Date();

    await session.save();

    return {
      newAccessToken,
      newRefreshToken,
    };
  },
  async forgotPassword(email: string) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError('User related to this email no longer existed.', HTTP_STATUS.NOT_FOUND);
    }

    const code = await VerificationCode.findOne({ user: user._id });
    if (code && code.expiresAt > new Date()) {
      throw new AppError('You already have a code, verify your email inbox.', HTTP_STATUS.CONFLICT);
    }

    const token = generateCode();
    await VerificationCode.create({
      user: user._id,
      code: hashCode(token),
      type: 'passwordReset',
      expiresAt: new Date(new Date().getTime() + 60 * 60 * 1000),
    });
    const resetLink = `${env.CLIENT_URL}/auth/reset-password/${token}`;

    await emailQueue.add('reset-password', {
      type: 'password-reset',
      name: user.name,
      to: user.email,
      resetLink,
    });
  },
  async resetPassword(token: string, newPassword: string) {
    const resetCode = await VerificationCode.findOne({ code: hashCode(token) });
    if (!resetCode) {
      throw new AppError('Invalid or expired code', HTTP_STATUS.NOT_FOUND);
    }

    const user = await User.findById(resetCode.user);
    if (!user) {
      throw new AppError('User no longer exists', HTTP_STATUS.NOT_FOUND);
    }

    user.password = newPassword;
    await user.save();
    await VerificationCode.findByIdAndDelete(resetCode._id);
    await Session.updateMany(
      { user: user._id },
      {
        isValid: false,
        revokedReason: SESSION_REVOCATION_REASONS.PASSWORD_CHANGE,
        revokedAt: new Date(),
        lastUsedAt: new Date(),
      },
    );
  },
};
