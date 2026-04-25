import axios from 'axios';

// export const getErrorMessage = (err: unknown) => {
//   if (axios.isAxiosError(err)) {
//     return err.response?.data?.message || err.message;
//   }
//   if (err instanceof Error) {
//     return err.message;
//   }
//   return 'Something went wrong';
// };

export const getErrorMessage = (err: unknown): string => {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status;
    if (status === 401) return 'Invalid credentials.';
    if (status === 403) return 'Access denied.';
    if (status === 404) return 'Resource not found.';
    if (status === 429) return 'Too many requests. Please slow down.';
    if (status && status >= 500) return 'Server error. Please try again later.';
    // Only use backend message for 4xx client errors (e.g. validation)
    return err.response?.data?.message ?? 'Something went wrong.';
  }
  if (err instanceof Error) return 'Something went wrong.';
  return 'Something went wrong.';
};
