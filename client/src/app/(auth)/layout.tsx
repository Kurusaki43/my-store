'use client';

import { useAuthStore } from '@/features/auth/store';
import { useInitAuth } from '@/features/auth/hook';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';

const AuthLayout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { isLoading } = useInitAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/sessions');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || isAuthenticated) return null;

  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-cyan-500 to-green-300 p-2 sm:p-4 md:p-12">
      {children}
    </div>
  );
};

export default AuthLayout;
