import type { Response } from "express";

export const sendSuccess = (
  res: Response,
  data: unknown,
  statusCode = 200,
  meta?: Record<string, unknown>,
): void => {
  res.status(statusCode).json({ success: true, data, ...(meta && { meta }) });
};

export const sendFail = (res: Response, message: string, statusCode = 400): void => {
  res.status(statusCode).json({ success: false, message });
};
