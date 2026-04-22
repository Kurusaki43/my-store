import { api } from '@/lib/axios';
import { LoginResponse, RegisterResponse } from './responses';
import { LoginDTO, RegisterDTO } from './types';

export const loginRequest = async (data: LoginDTO): Promise<LoginResponse> => {
  const res = await api.post<LoginResponse>('/auth/login', data);
  return res.data;
};

export const registerRequest = async (data: RegisterDTO) => {
  const res = await api.post<RegisterResponse>('/auth/register', data);
  return res.data;
};
