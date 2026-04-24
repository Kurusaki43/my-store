'use client';

import { useInitAuth } from '@/features/auth/hook';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { isError, isLoading } = useInitAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isError) {
      router.replace('/login');
    }
  }, [isLoading, isError, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-linear-to-br from-indigo-600 to-cyan-400">
        <span className="size-10 rounded-full border-4 border-white border-t-transparent animate-spin" />
        <p className="text-white font-semibold tracking-wide animate-pulse">Loading...</p>
      </div>
    );
  }

  if (isError) return null;

  return <>{children}</>;
}
