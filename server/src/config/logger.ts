import { createLogger, format, transports, addColors } from 'winston';
import { env } from '@/config/env';

const customLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
  },
  colors: {
    error: 'bold red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'gray',
  },
};

addColors(customLevels.colors);

const { combine, timestamp, colorize, printf, errors, splat } = format;

const devFormat = combine(
  colorize({ all: true }),
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  errors({ stack: true }),
  splat(),
  printf(({ level, message, timestamp, stack, ...meta }) => {
    const stackStr = typeof stack === 'string' ? `\n${stack}` : '';
    const metaStr = Object.keys(meta).length ? `\nmeta: ${JSON.stringify(meta, null, 2)}` : '';
    return [`[${String(timestamp)}]`, level, String(message), stackStr, metaStr].join(' ');
  }),
);

const prodFormat = combine(
  timestamp(),
  splat(),
  printf(({ level, message, timestamp, statusCode, method, url, errorName }) => {
    return JSON.stringify({ timestamp, level, message, statusCode, method, url, errorName });
  }),
);

export const logger = createLogger({
  levels: customLevels.levels,
  level: env.NODE_ENV === 'production' ? env.LOG_LEVEL : 'debug',
  format: env.NODE_ENV === 'production' ? prodFormat : devFormat,
  transports: [
    ...(env.NODE_ENV === 'production'
      ? [
          new transports.File({ filename: 'logs/error.log', level: 'error' }),
          new transports.File({ filename: 'logs/combined.log' }),
        ]
      : [new transports.Console()]),
  ],

  exceptionHandlers: [new transports.File({ filename: 'logs/exceptions.log' })],
  rejectionHandlers: [new transports.File({ filename: 'logs/rejections.log' })],
});

export const morganStream = {
  write: (message: string) => {
    logger.http(message.trim());
  },
};
