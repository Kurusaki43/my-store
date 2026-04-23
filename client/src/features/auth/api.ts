import { api } from '@/lib/axios';
import {
  ForgotPasswordResponse,
  GetSessionsResponse,
  LoginResponse,
  RegisterResponse,
  ResetPasswordResponse,
} from './responses';
import { ForgotPasswordDTO, LoginDTO, RegisterDTO, ResetPasswordDTO } from './types';

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

export const resetPasswordRequest = async (data: ResetPasswordDTO) => {
  const { token, ...restData } = data;
  const res = await api.patch<ResetPasswordResponse>(`/auth/reset-password/${token}`, restData);
  return res.data;
};

export const getSessionsRequest = async () => {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  const res = await api.get<GetSessionsResponse>(`/auth/sessions`);
  return res.data;
};
