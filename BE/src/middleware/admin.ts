import type { Request, Response, NextFunction } from 'express';
import type { AuthUser } from '../models/index.js';

type AuthRequest = Request & { user?: AuthUser };

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.isAuthenticated() || !req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  if (!req.user.isAdmin) {
    return res.status(403).json({ error: 'Forbidden - Admin access required' });
  }
  next();
}
