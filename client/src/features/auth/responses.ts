import { ApiResponse } from '@/types/api-response';
import { UserDTO } from '../users/types';
import { Session } from './types';

interface LoginResponseData {
  user: UserDTO;
  accessToken: string;
}

export type LoginResponse = ApiResponse<LoginResponseData>;
export type RegisterResponse = LoginResponse;
export type GoogleAuthResponse = LoginResponse;
export type ForgotPasswordResponse = ApiResponse<null>;
export type ResetPasswordResponse = ApiResponse<null>;

export type GetSessionsResponse = ApiResponse<{ sessions: Session[] }>;
export type LogoutResponse = ApiResponse<null>;
export type LogoutSessionResponse = LogoutResponse;
export type LogoutAllSessionsResponse = LogoutResponse;
