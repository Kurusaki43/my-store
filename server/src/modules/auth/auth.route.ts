import { Router } from 'express';
import { AuthController } from './auth.controller';
import { validate } from '@/middlewares/validation';
import { registerSchema } from './auth.validation';

export const authRoute = Router();

authRoute.post('/register', validate({ body: registerSchema }), AuthController.register);
