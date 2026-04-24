import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from './store';
import {
  forgotPasswordRequest,
  getMeRequest,
  getSessionsRequest,
  loginRequest,
  logoutAllSessionsRequest,
  refreshRequest,
  registerRequest,
  resetPasswordRequest,
} from './api';

/* =========================
   MUTATIONS
========================= */

export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: loginRequest,
    onSuccess: (res) => {
      const { user, accessToken } = res.data;
      setAuth({ accessToken, user });

      queryClient.setQueryData(['me'], user);
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      queryClient.removeQueries({ queryKey: ['init-auth'] });
    },
  });
};

export const useRegister = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: registerRequest,
    onSuccess: (res) => {
      const { user, accessToken } = res.data;
      setAuth({ accessToken, user });

      queryClient.setQueryData(['me'], user);
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      queryClient.removeQueries({ queryKey: ['init-auth'] });
    },
  });
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
  return useQuery({
    queryKey: ['me'],
    queryFn: getMeRequest,
    staleTime: 5 * 60 * 1000,
  });
};

/* =========================
   INIT AUTH (BOOTSTRAP)
========================= */
export const useInitAuth = () => {
  const setAuth = useAuthStore((s) => s.setAuth);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoggingOut = useAuthStore((s) => s.isLoggingOut);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

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
