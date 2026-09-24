import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/helpers';
import { env } from '../config/env';

/**
 * Central error handler — catches unhandled errors and returns the standard envelope
 * Never exposes stack traces in production
 */
export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction): void {
  console.error(`[ERROR] ${req.method} ${req.path}:`, err.message);

  if (env.NODE_ENV === 'development') {
    console.error(err.stack);
  }

  sendError(
    res,
    'INTERNAL_ERROR',
    env.NODE_ENV === 'production' ? 'An unexpected error occurred' : err.message,
    500
  );
}
