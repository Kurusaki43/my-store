import { HTTP_STATUS } from '@/constants/httpStatus';
import type { RequestHandler } from 'express';
import type { ParamsDictionary } from 'express-serve-static-core';
import type { ParsedQs } from 'qs';
import * as z from 'zod';
import type { ZodType } from 'zod';

export const validate =
  <TBody = unknown, TQuery = ParsedQs, TParams = ParamsDictionary>(schemas: {
    body?: ZodType<TBody>;
    query?: ZodType<TQuery>;
    params?: ZodType<TParams>;
  }): RequestHandler<TParams, unknown, TBody, TQuery> =>
  async (req, _res, next) => {
    try {
      if (schemas.body) {
        req.body = await schemas.body.parseAsync(req.body);
      }

      if (schemas.query) {
        req.query = await schemas.query.parseAsync(req.query);
      }

      if (schemas.params) {
        req.params = await schemas.params.parseAsync(req.params);
      }

      next();
      return;
    } catch (error) {
      if (error instanceof z.ZodError) {
        next({
          name: error.name,
          issues: error.issues,
          message: 'Validation Error - Invalid request data',
          statusCode: HTTP_STATUS.BAD_REQUEST,
        });
        return;
      }
      next(error);
    }
  };
