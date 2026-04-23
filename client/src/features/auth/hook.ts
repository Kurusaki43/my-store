import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from './store';
import { forgotPasswordRequest, loginRequest, registerRequest, resetPasswordRequest } from './api';
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
      router.push('/');
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
