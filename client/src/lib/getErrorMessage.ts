import axios from 'axios';

export const getErrorMessage = (err: unknown) => {
  if (axios.isAxiosError(err)) {
    return err.response?.data?.message || err.message;
  }
  if (err instanceof Error) {
    return err.message;
  }
  return 'Something went wrong';
};
