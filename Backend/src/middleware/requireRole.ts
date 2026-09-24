import { Response, NextFunction } from 'express';
import { AuthenticatedRequest, UserRole } from '../types';
import { sendError } from '../utils/helpers';

/**
 * Middleware factory: require a specific role (applied at router level per Section 10)
 * Accepts role strings individually or array of roles
 */
export function requireRole(...allowedRoles: (UserRole | UserRole[])[]) {
  const roles = allowedRoles.flat();

  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendError(res, 'UNAUTHORIZED', 'Authentication required', 401);
      return;
    }

    if (!roles.includes(req.user.role)) {
      sendError(res, 'FORBIDDEN', `Access denied. Required role: ${roles.join(' or ')}`, 403);
      return;
    }

    next();
  };
}
