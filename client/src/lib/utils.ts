import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { jwtDecode } from 'jwt-decode';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type TokenPayload = {
  sessionId: string;
  userId: string;
};

export const getSessionIdFromToken = (token: string | null) => {
  if (!token) return null;

  try {
    const decoded = jwtDecode<TokenPayload>(token);
    return decoded.sessionId;
  } catch {
    return null;
  }
};
