import type { Response } from "express";

export const sendSuccess = <T>(
  res: Response,
  data: T,
  statusCode = 200,
  meta?: Record<string, unknown>,
) => {
  res.status(statusCode).json({ success: true, data, ...(meta && { meta }) });
};

export const sendFail = (res: Response, message: string, statusCode = 400) => {
  res.status(statusCode).json({ success: false, message });
};
