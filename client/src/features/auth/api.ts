import { api } from '@/lib/axios';
import { ForgotPasswordResponse, LoginResponse, RegisterResponse } from './responses';
import { ForgotPasswordDTO, LoginDTO, RegisterDTO } from './types';

export const loginRequest = async (data: LoginDTO): Promise<LoginResponse> => {
  const res = await api.post<LoginResponse>('/auth/login', data);
  return res.data;
};

export const registerRequest = async (data: RegisterDTO) => {
  const res = await api.post<RegisterResponse>('/auth/register', data);
  return res.data;
};

export const forgotPasswordRequest = async (email: ForgotPasswordDTO) => {
  const res = await api.post<ForgotPasswordResponse>('/auth/forgot-password', email);
  return res.data;
};
