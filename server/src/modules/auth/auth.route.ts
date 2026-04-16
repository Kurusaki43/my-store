import { Router } from 'express';
import { AuthController } from './auth.controller';
import { validate } from '@/middlewares/validation';
import { loginSchema, registerSchema } from './auth.validation';

export const authRoute = Router();

authRoute.post('/register', validate({ body: registerSchema }), AuthController.register);
authRoute.post('/login', validate({ body: loginSchema }), AuthController.login);
authRoute.post('/logout', AuthController.logout);
