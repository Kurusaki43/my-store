import type { Document, Types } from 'mongoose';

export const VERIFICATION_CODE_TYPES = {
  PASSWORD_RESET: 'passwordReset',
  EMAIL_VERIFICATION: 'emailVerification',
} as const;

export type VerificationCodeType =
  (typeof VERIFICATION_CODE_TYPES)[keyof typeof VERIFICATION_CODE_TYPES];

export interface IVerificationCode extends Document {
  user: Types.ObjectId;
  code: string;
  type: VerificationCodeType;
  expiresAt: Date;
}

export const SESSION_REVOCATION_REASONS = {
  USER_LOGOUT: 'userLogout',
  PASSWORD_CHANGE: 'passwordChange',
  SECURITY_ISSUE: 'securityIssue',
} as const;

export type SessionRevocationReason =
  (typeof SESSION_REVOCATION_REASONS)[keyof typeof SESSION_REVOCATION_REASONS];

export interface ISession extends Document {
  user: Types.ObjectId;
  refreshTokenHash: string;
  isValid: boolean;
  userAgent?: string;
  ip?: string;
  revokedReason?: SessionRevocationReason | null;
  lastUsedAt: Date;
  revokedAt?: Date | null;
  expiresAt: Date;
}
