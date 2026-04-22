import { ReactNode } from 'react';

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-cyan-500 to-green-300 p-2 sm:p-4 md:p-12">
      {children}
    </div>
  );
};

export default AuthLayout;
