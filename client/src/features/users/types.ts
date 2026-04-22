export const Role = {
  USER: 'user',
  ADMIN: 'admin',
} as const;

export type RoleType = (typeof Role)[keyof typeof Role];

export interface Address {
  country: string;
  city: string;
  state?: string;
  street: string;
  zipCode?: string;
  isDefault: boolean;
}

export interface UserDTO {
  _id: string;
  name: string;
  email: string;
  role: RoleType;
  avatar?: string;
  address: Address[];
  phone?: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}
