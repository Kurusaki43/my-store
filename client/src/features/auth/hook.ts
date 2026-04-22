import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from './store';
import { loginRequest } from './api';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

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
  });
};
