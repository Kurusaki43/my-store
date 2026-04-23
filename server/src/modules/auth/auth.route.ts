import { Router } from 'express';
import { AuthController } from './auth.controller';
import { validate } from '@/middlewares/validation';
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordParamsSchema,
  resetPasswordSchema,
} from './auth.validation';
import { protect } from '@/middlewares/auth';

export const authRoute = Router();

authRoute.post('/register', validate({ body: registerSchema }), AuthController.register);
authRoute.post('/login', validate({ body: loginSchema }), AuthController.login);
authRoute.post('/logout', AuthController.logout);
authRoute.post('/refresh', AuthController.refresh);

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
