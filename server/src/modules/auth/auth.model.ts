import { model, Schema } from 'mongoose';

import {
  SESSION_REVOCATION_REASONS,
  VERIFICATION_CODE_TYPES,
  type ISession,
  type IVerificationCode,
} from './auth.types';

const verificationCodeSchema = new Schema<IVerificationCode>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Verification code should be linked to a user'],
    },
    code: {
      type: String,
      required: [true, 'Verification code is required'],
    },
    type: {
      type: String,
      enum: Object.values(VERIFICATION_CODE_TYPES),
      required: [true, 'Verification code type is required'],
    },
    expiresAt: {
      type: Date,
      required: [true, 'Expiration date is required'],
    },
  },
  {
    timestamps: true,
  },
);
verificationCodeSchema.index({ user: 1, type: 1 });
verificationCodeSchema.index({ code: 1 });
verificationCodeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const VerificationCode = model<IVerificationCode>(
  'VerificationCode',
  verificationCodeSchema,
);

const sessionSchema = new Schema<ISession>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Session must be linked to a user'],
      index: true,
    },

    refreshTokenHash: {
      type: String,
      required: [true, 'Refresh token hash is required'],
      index: true,
    },

    userAgent: String,

    ip: String,

    isValid: {
      type: Boolean,
      default: true,
    },
    expiresAt: {
      type: Date,
      required: [true, 'Expiration date is required'],
    },
    revokedReason: {
      type: String,
      enum: Object.values(SESSION_REVOCATION_REASONS),
      default: null,
    },
    revokedAt: {
      type: Date,
      default: null,
    },
    lastUsedAt: {
      type: Date,
      default: () => Date.now(),
    },
  },
  {
    timestamps: true,
  },
);

sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Session = model<ISession>('Session', sessionSchema);
