import { Request, Response, NextFunction } from 'express';
import type { UserRole } from '../types';

/**
 * In the microservices pattern, the API gateway validates the JWT
 * and forwards user info as trusted headers.
 * claims-service trusts these headers (internal traffic only).
 */
export function requireRole(allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const role = req.headers['x-user-role'] as UserRole | undefined;

    if (!role) {
      res.status(401).json({
        success: false,
        error: { message: 'Unauthorized: missing role header' },
      });
      return;
    }

    if (!allowedRoles.includes(role)) {
      res.status(403).json({
        success: false,
        error: {
          message: `Forbidden: requires one of [${allowedRoles.join(', ')}]`,
          code: 'INSUFFICIENT_ROLE',
        },
      });
      return;
    }

    next();
  };
}
