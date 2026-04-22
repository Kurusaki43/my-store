import { api } from '@/lib/axios';
import { LoginResponse } from './responses';
import { LoginDTO } from './types';

export const loginRequest = async (data: LoginDTO): Promise<LoginResponse> => {
  const res = await api.post<LoginResponse>('/auth/login', data);
  return res.data;
};
