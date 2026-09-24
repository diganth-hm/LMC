import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { sendError } from '../utils/helpers';

/**
 * Middleware factory: validate request body/query/params against a Zod schema
 */
export function validateRequest(schema: ZodSchema, source: 'body' | 'query' | 'params' = 'body') {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const data = schema.parse(req[source]);
      // Replace the source with parsed/transformed data
      (req as any)[source] = data;
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const message = err.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('; ');
        sendError(res, 'VALIDATION_ERROR', message, 400);
        return;
      }
      next(err);
    }
  };
}
