import type { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../lib/auth.js';

export type OptionalAuthRequest = Request & { user?: { id: string; role: string } };

export function optionalAuth(req: OptionalAuthRequest, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header) return next();
  const [, token] = header.split(' ');
  if (!token) return next();
  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.sub, role: payload.role };
  } catch {
    req.user = undefined;
  }
  return next();
}
