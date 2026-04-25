import type { Document } from 'mongoose';

export const Role = {
  USER: 'user',
  ADMIN: 'admin',
} as const;
export const Provider = {
  LOCAL: 'local',
  GOOGLE: 'google',
} as const;
export type RoleType = (typeof Role)[keyof typeof Role];
export type ProviderType = (typeof Provider)[keyof typeof Provider];
export interface Address {
  country: string;
  city: string;
  state?: string;
  street: string;
  zipCode?: string;
  isDefault?: boolean;
}
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: RoleType;
  avatar?: string;
  address?: Address[];
  phone?: string;
  isActive: boolean;
  isVerified: boolean;
  provider: ProviderType;
  createdAt: Date;
  updatedAt: Date;

  comparePassword(candidatePassword: string): Promise<boolean>;
}
