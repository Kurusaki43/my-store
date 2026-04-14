import type { Request, Response, NextFunction } from 'express';
import type { ZodError } from 'zod';
import { Error as MongooseError } from 'mongoose';
import { AppError } from '@/utils/AppError';
import { logger } from '@/config/logger';
import { env } from '@/config/env';
import { HTTP_STATUS } from '@/constants/httpStatus';

interface NormalizedError {
  statusCode: number;
  message: string;
}

interface MongoServerError extends Error {
  code: number;
  keyValue: Record<string, unknown>;
}

const handleZodError = (err: ZodError): NormalizedError => ({
  statusCode: HTTP_STATUS.BAD_REQUEST,
  message: err.issues.map((e) => `${e.path.join('.')}: ${e.message}`).join(', '),
});

const handleValidationError = (err: MongooseError.ValidationError): NormalizedError => ({
  statusCode: HTTP_STATUS.BAD_REQUEST,
  message: Object.values(err.errors)
    .map((e) => e.message)
    .join(', '),
});

const handleCastError = (err: MongooseError.CastError): NormalizedError => ({
  statusCode: HTTP_STATUS.BAD_REQUEST,
  message: `Invalid ${err.path}: ${String(err.value)}`,
});

const handleDuplicateKey = (err: MongoServerError): NormalizedError => {
  const field = Object.keys(err.keyValue)[0] ?? 'field';
  return {
    statusCode: HTTP_STATUS.CONFLICT,
    message: `${field} already exists`,
  };
};

const handleJwtError = (err: Error): NormalizedError => ({
  statusCode: HTTP_STATUS.UNAUTHORIZED,
  message: err.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token',
});

const isMongoServerError = (err: unknown): err is MongoServerError =>
  err instanceof Error && 'code' in err && (err as MongoServerError).code === 11000;

const isZodError = (error: unknown): error is ZodError => {
  return (
    typeof error === 'object' && error !== null && 'name' in error && error.name === 'ZodError'
  );
};

const normalizeError = (err: unknown): NormalizedError => {
  if (err instanceof AppError) {
    return { statusCode: err.statusCode, message: err.message };
  }
  if (isZodError(err)) {
    return handleZodError(err);
  }
  if (err instanceof MongooseError.ValidationError) {
    return handleValidationError(err);
  }
  if (err instanceof MongooseError.CastError) {
    return handleCastError(err);
  }
  if (isMongoServerError(err)) {
    return handleDuplicateKey(err);
  }
  if (err instanceof Error && ['JsonWebTokenError', 'TokenExpiredError'].includes(err.name)) {
    return handleJwtError(err);
  }

  return {
    statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    message: 'Internal Server Error',
  };
};

export const notFound = (req: Request, _res: Response, next: NextFunction): void => {
  next(new AppError(`Route ${req.originalUrl} not found`, HTTP_STATUS.NOT_FOUND));
};

export const globalErrorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  const { statusCode, message } = normalizeError(err);

  logger.error(`[${req.method}] ${req.originalUrl} — ${message}`, {
    stack: err instanceof Error ? err.stack : undefined,
  });

  if (env.NODE_ENV === 'development') {
    res.status(statusCode).json({
      success: false,
      statusCode,
      message,
      error: err,
      stack: err instanceof Error ? err.stack : undefined,
    });
    return;
  }

  res.status(statusCode).json({ success: false, message });
};
