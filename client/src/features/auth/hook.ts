import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from './store';
import {
  deleteSessionRequest,
  forgotPasswordRequest,
  getMeRequest,
  getSessionsRequest,
  googleAuthRequest,
  loginRequest,
  logoutAllSessionsRequest,
  logoutRequest,
  refreshRequest,
  registerRequest,
  resetPasswordRequest,
} from './api';
import { useShallow } from 'zustand/react/shallow';
import { LoginResponse } from './responses';

/* =========================
   MUTATIONS
========================= */
const usePostAuthSuccess = () => {
  const setAuth = useAuthStore((s) => s.setAuth);
  const queryClient = useQueryClient();
  return (res: LoginResponse) => {
    const { user, accessToken } = res.data;
    setAuth({ accessToken, user });
    queryClient.setQueryData(['me'], user);
    queryClient.invalidateQueries({ queryKey: ['sessions'] });
    queryClient.removeQueries({ queryKey: ['init-auth'] });
  };
};

export const useLogin = () => {
  const onAuthSuccess = usePostAuthSuccess();
  return useMutation({ mutationFn: loginRequest, onSuccess: onAuthSuccess });
};

export const useRegister = () => {
  const onAuthSuccess = usePostAuthSuccess();
  return useMutation({ mutationFn: registerRequest, onSuccess: onAuthSuccess });
};

export const useGoogleAuth = () => {
  const onAuthSuccess = usePostAuthSuccess();
  return useMutation({ mutationFn: googleAuthRequest, onSuccess: onAuthSuccess });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: forgotPasswordRequest,
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: resetPasswordRequest,
  });
};

export const useLogout = () => {
  const clearAuth = useAuthStore((s) => s.clearAuth);
  return useMutation({
    mutationFn: logoutRequest,
    onSettled: () => {
      clearAuth();
      window.location.replace('/login');
    },
  });
};

export const useDeleteSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSessionRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });
};

export const useLogoutAllSessions = () => {
  const clearAuth = useAuthStore((s) => s.clearAuth);
  return useMutation({
    mutationFn: logoutAllSessionsRequest,
    onSuccess: () => {
      clearAuth();
      window.location.replace('/login');
    },
  });
};

/* =========================
   QUERIES
========================= */
export const useGetSessions = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: ['sessions'],
    queryFn: getSessionsRequest,
    enabled: isAuthenticated,
  });
};

export const useGetMe = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: ['me'],
    queryFn: getMeRequest,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  });
};

/* =========================
   INIT AUTH (BOOTSTRAP)
========================= */
export const useInitAuth = () => {
  const setAuth = useAuthStore((s) => s.setAuth);
  const { isAuthenticated, isLoggingOut, setAccessToken } = useAuthStore(
    useShallow((s) => ({
      isAuthenticated: s.isAuthenticated,
      isLoggingOut: s.isLoggingOut,
      setAccessToken: s.setAccessToken,
    })),
  );
  return useQuery({
    queryKey: ['init-auth'],
    queryFn: async () => {
      const { data: refreshData } = await refreshRequest();

      const accessToken = refreshData.accessToken;
      setAccessToken(accessToken);

      const { data: meData } = await getMeRequest();
      setAuth({ accessToken, user: meData.user });

      return meData.user;
    },
    enabled: !isAuthenticated && !isLoggingOut,
    retry: false,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
};
