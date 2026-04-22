import z from 'zod';

const emailSchema = z.email('Please enter a valid email');
const passwordSchema = z
  .string({
    error: 'Password is required',
  })
  .min(8, 'Password must be at least 8 characters')
  .max(32, 'Password must be at most 32 characters');

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});
export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z.string().min(4, 'Name should be abouve 4 characters'),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

export type RegisterInput = z.infer<typeof registerSchema>;
