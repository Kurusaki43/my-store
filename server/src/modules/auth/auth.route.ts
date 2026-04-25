import { Router } from 'express';
import { AuthController } from './auth.controller';
import { validate } from '@/middlewares/validation';
import {
  forgotPasswordSchema,
  googleAuthSchema,
  loginSchema,
  registerSchema,
  resetPasswordParamsSchema,
  resetPasswordSchema,
} from './auth.validation';
import { protect } from '@/middlewares/auth';
import { authLimiter, refreshLimiter } from '@/middlewares/rateLimit';

export const authRoute = Router();

authRoute.post(
  '/register',
  authLimiter,
  validate({ body: registerSchema }),
  AuthController.register,
);
authRoute.post('/login', authLimiter, validate({ body: loginSchema }), AuthController.login);
authRoute.post(
  '/google',
  authLimiter,
  validate({ body: googleAuthSchema }),
  AuthController.googleAuth,
);
authRoute.post('/logout', AuthController.logout);
authRoute.post('/refresh', refreshLimiter, AuthController.refresh);
authRoute.post(
  '/forgot-password',
  validate({ body: forgotPasswordSchema }),
  AuthController.forgotPassword,
);

authRoute.patch(
  '/reset-password/:token',
  validate({
    params: resetPasswordParamsSchema,
    body: resetPasswordSchema,
  }),
  AuthController.resetPassword,
);

authRoute
  .route('/sessions')
  .get(protect, AuthController.getSessions)
  .delete(protect, AuthController.deleteAllSessions);

authRoute.delete('/sessions/:sessionId', protect, AuthController.deleteSession);

authRoute.get('/me', protect, AuthController.getMe);
