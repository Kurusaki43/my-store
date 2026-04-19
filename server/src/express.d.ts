import 'express';
import { type RoleType } from './modules/user/user.types';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      sessionId?: string;
      role?: RoleType;
    }
  }
}

export {};
