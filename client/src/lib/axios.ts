import { useAuthStore } from '@/features/auth/store';
import { ApiResponse } from '@/types/api-response';
import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

let isRefreshing = false;

let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token as string);
  });

  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;
    const authStore = useAuthStore.getState();

    const status = error.response?.status;

    if (status !== 401) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      authStore.clearAuth();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    const publicRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];

    if (typeof window !== 'undefined') {
      const path = window.location.pathname;

      if (publicRoutes.includes(path)) {
        authStore.clearAuth();
        return Promise.reject(error);
      }
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      });
    }

    isRefreshing = true;

    try {
      const { data: resData } =
        await api.post<ApiResponse<{ accessToken: string }>>('/auth/refresh');

      const newAccessToken = resData.data.accessToken;
      authStore.setAccessToken(newAccessToken);
      processQueue(null, newAccessToken);
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      authStore.clearAuth();

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);
