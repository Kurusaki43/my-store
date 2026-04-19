import z from 'zod';

const emailSchema = z.email('Please provide a valid email');
const passwordSchema = z
  .string({ error: 'Password is required' })
  .min(8, 'Password must be at least 8 characters long');

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: z.string({ error: 'Name is required' }).min(1, 'Name is required'),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export type LoginDTO = z.infer<typeof loginSchema>;
export type RegisterDTO = z.infer<typeof registerSchema>;
export type ForgotPasswordDTO = z.infer<typeof forgotPasswordSchema>;
