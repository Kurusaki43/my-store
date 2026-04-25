import z from 'zod';

const emailSchema = z.email('Please provide a valid email');
const passwordSchema = z
  .string({ error: 'Password is required' })
  .min(8, 'Password must be at least 8 characters long')
  .max(32, 'Password must be at most 32 characters long');

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: z.string({ error: 'Name is required' }).min(1, 'Name is required'),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});
export const googleAuthSchema = z.object({
  idToken: z.string({ error: 'idToken is required' }),
});
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z
  .object({
    newPassword: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.confirmPassword === data.newPassword, {
    path: ['confirmPassword'],
    error: "Passwords don't match",
  });

export const resetPasswordParamsSchema = z.object({
  token: z
    .string({ error: 'Token is required' })
    .min(32, 'Token is required and must be 32 characters long')
    .max(32, 'Token is required and must be 32 characters long'),
});
export type ResetPasswordDTO = z.infer<typeof resetPasswordSchema>;
export type ResetPasswordParamsDTO = z.infer<typeof resetPasswordParamsSchema>;

export type LoginDTO = z.infer<typeof loginSchema>;
export type RegisterDTO = z.infer<typeof registerSchema>;
export type GoogleAuthDTO = z.infer<typeof googleAuthSchema>;
export type ForgotPasswordDTO = z.infer<typeof forgotPasswordSchema>;
