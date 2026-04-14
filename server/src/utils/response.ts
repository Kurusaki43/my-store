import type { HTTP_STATUS } from '@/constants/httpStatus';
import type { Response } from 'express';

type HttpStatus = (typeof HTTP_STATUS)[keyof typeof HTTP_STATUS];

interface SendSuccessParams {
  res: Response;
  statusCode: HttpStatus;
  msg: string;
  data?: Record<string, unknown>;
  meta?: Record<string, unknown>;
}

export const sendSuccess = ({ res, msg, data, statusCode, meta }: SendSuccessParams): void => {
  res.status(statusCode).json({ success: true, msg, data, ...(meta && { meta }) });
};

export const sendFail = (res: Response, message: string, statusCode = 400): void => {
  res.status(statusCode).json({ success: false, message });
};
