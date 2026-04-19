import { HTTP_STATUS } from '@/constants/httpStatus';
import { Session } from '@/modules/auth/auth.model';
import { AppError } from '@/utils/AppError';
import { verifyToken } from '@/utils/jwt';
import { type RequestHandler } from 'express';

export const protect: RequestHandler = async (req, _res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    throw new AppError('Unauthorized, token not found', HTTP_STATUS.UNAUTHORIZED);
  }

  const { userId, sessionId, role } = verifyToken(token);

  const session = await Session.findById(sessionId);
  if (!session?.isValid || session.expiresAt < new Date()) {
    throw new AppError('Unauthorized, session is invalid or expired', HTTP_STATUS.UNAUTHORIZED);
  }

  req.userId = userId.toString();
  req.sessionId = sessionId.toString();
  req.role = role;

  next();
};

export const restrictTo = (...roles: string[]): RequestHandler => {
  return (req, _res, next) => {
    if (!req.role) {
      throw new AppError('Unauthorized', HTTP_STATUS.UNAUTHORIZED);
    }

    if (!roles.includes(req.role)) {
      throw new AppError(
        'You do not have permission to perform this action',
        HTTP_STATUS.FORBIDDEN,
      );
    }
    next();
  };
};
