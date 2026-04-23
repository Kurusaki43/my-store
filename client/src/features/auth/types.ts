export const SESSION_REVOCATION_REASONS = {
  USER_LOGOUT: 'userLogout',
  PASSWORD_CHANGE: 'passwordChange',
  SECURITY_ISSUE: 'securityIssue',
} as const;

export type SessionRevocationReason =
  (typeof SESSION_REVOCATION_REASONS)[keyof typeof SESSION_REVOCATION_REASONS];

export interface Session {
  _id: string;
  user: string;
  isValid: boolean;
  userAgent: string;
  ip: string;
  revokedReason?: SessionRevocationReason | null;
  lastUsedAt: string;
  revokedAt?: string | null;
  expiresAt: string;
  createdAt: string;
}

export type LoginDTO = {
  email: string;
  password: string;
};

export type RegisterDTO = {
  name: string;
  email: string;
  password: string;
};

export type ForgotPasswordDTO = {
  email: string;
};

export type ResetPasswordDTO = {
  newPassword: string;
  confirmPassword: string;
  token: string;
};
