import { UserDTO } from '../users/types';
import { create } from 'zustand';

interface AuthStore {
  user: UserDTO | null;
  accessToken: string | null;
  isAuthenticated: boolean;

  setAuth: (data: { user: UserDTO; accessToken: string }) => void;
  setAccessToken: (accessToken: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,

  setAuth: ({ user, accessToken }) =>
    set({
      user,
      accessToken,
      isAuthenticated: true,
    }),
  setAccessToken: (accessToken) =>
    set((state) => ({
      accessToken,
      isAuthenticated: !!state.user,
    })),
  clearAuth: () =>
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
    }),
}));
