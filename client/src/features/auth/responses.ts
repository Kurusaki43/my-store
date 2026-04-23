import { ApiResponse } from '@/types/api-response';
import { UserDTO } from '../users/types';
import { Session } from './types';

interface LoginResponseData {
  user: UserDTO;
  accessToken: string;
}

export type LoginResponse = ApiResponse<LoginResponseData>;
export type RegisterResponse = ApiResponse<LoginResponseData>;
export type ForgotPasswordResponse = ApiResponse<null>;
export type ResetPasswordResponse = ApiResponse<null>;

export type GetSessionsResponse = ApiResponse<{ sessions: Session[] }>;
