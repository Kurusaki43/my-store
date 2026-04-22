import { ApiResponse } from '@/types/api-response';
import { UserDTO } from '../users/types';

interface LoginResponseData {
  user: UserDTO;
  accessToken: string;
}

export type LoginResponse = ApiResponse<LoginResponseData>;

export type RegisterResponse = ApiResponse<LoginResponseData>;
