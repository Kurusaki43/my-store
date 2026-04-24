import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from './store';
import {
  forgotPasswordRequest,
  getMeRequest,
  getSessionsRequest,
  loginRequest,
  logoutAllSessions,
  refreshRequest,
  registerRequest,
  resetPasswordRequest,
} from './api';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { getErrorMessage } from '@/lib/getErrorMessage';

export const useLogin = () => {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  return useMutation({
    mutationFn: loginRequest,
    onSuccess: (res) => {
      const { user, accessToken } = res.data;
      setAuth({ accessToken, user });
      toast.success(`Welcome, ${user.name} 👋`);
      router.push('/sessions');
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      toast.error(message);
    },
  });
};

export const useRegister = () => {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  return useMutation({
    mutationFn: registerRequest,
    onSuccess: (res) => {
      const { user, accessToken } = res.data;
      setAuth({ accessToken, user });
      toast.success(`Account created! Welcome, ${user.name} 👋`);
      router.push('/');
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      toast.error(message);
    },
  });
};

export const useForgotPassword = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: forgotPasswordRequest,
    onSuccess: (res) => {
      toast.success(res.message);
      router.push('/');
    },

    onError: (err) => {
      const message = getErrorMessage(err);
      toast.error(message);
    },
  });
};

export const useResetPassword = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: resetPasswordRequest,
    onSuccess: (res) => {
      toast.success(res.message);
      router.push('/login');
    },

    onError: (err) => {
      const message = getErrorMessage(err);
      toast.error(message);
    },
  });
};

export const useGetSessions = () => {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ['sessions'],
    queryFn: getSessionsRequest,
    enabled: !!accessToken,
  });
};

export const useLogoutAllSessions = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const clearAuth = useAuthStore((s) => s.clearAuth);

  return useMutation({
    mutationFn: logoutAllSessions,
    onSuccess: (res) => {
      toast.success(res.message);
      clearAuth();
      queryClient.clear();
      router.push('/login');
    },

    onError: (err) => {
      const message = getErrorMessage(err);
      toast.error(message);
    },
  });
};

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
  });
};
