import { api, refreshApi } from '@/lib/axios';
import {
  ForgotPasswordResponse,
  GetSessionsResponse,
  GoogleAuthResponse,
  LoginResponse,
  LogoutAllSessionsResponse,
  LogoutResponse,
  LogoutSessionResponse,
  RegisterResponse,
  ResetPasswordResponse,
} from './responses';
import { ForgotPasswordDTO, LoginDTO, RegisterDTO, ResetPasswordDTO } from './types';
import { ApiResponse } from '@/types/api-response';
import { UserDTO } from '../users/types';

export const loginRequest = async (data: LoginDTO): Promise<LoginResponse> => {
  const res = await api.post<LoginResponse>('/auth/login', data);
  return res.data;
};

export const registerRequest = async (data: RegisterDTO) => {
  const res = await api.post<RegisterResponse>('/auth/register', data);
  return res.data;
};

export const googleAuthRequest = async (idToken: { idToken: string }) => {
  const res = await api.post<GoogleAuthResponse>('/auth/google', idToken);
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

export const logoutRequest = async () => {
  const res = await api.post<LogoutResponse>('/auth/logout/');
  return res.data;
};

export const getSessionsRequest = async () => {
  const res = await api.get<GetSessionsResponse>(`/auth/sessions`);
  return res.data;
};

export const deleteSessionRequest = async (sessionId: string) => {
  const res = await api.delete<LogoutSessionResponse>(`/auth/sessions/${sessionId}`);
  return res.data;
};

export const logoutAllSessionsRequest = async () => {
  const res = await api.delete<LogoutAllSessionsResponse>(`/auth/sessions`);
  return res.data;
};

export const refreshRequest = async () => {
  const res = await refreshApi.post<ApiResponse<{ accessToken: string }>>('/auth/refresh');
  return res.data;
};

export const getMeRequest = async () => {
  const res = await api.get<ApiResponse<{ user: UserDTO }>>('/auth/me', {});
  return res.data;
};
