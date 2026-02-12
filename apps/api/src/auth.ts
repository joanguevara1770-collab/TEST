import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';
import { config } from './config.js';

export type AuthUser = {
  oid: string;
  name: string;
  email: string;
  groups: string[];
  isAdmin: boolean;
};

declare module 'express-serve-static-core' {
  interface Request {
    user?: AuthUser;
    accessToken?: string;
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const header = req.header('authorization');

  if (config.devBypassAuth && !header) {
    req.user = {
      oid: 'dev-user',
      name: 'Dev User',
      email: 'dev@example.com',
      groups: config.azure.adminGroupIds,
      isAdmin: true
    };
    req.accessToken = 'dev-token';
    return next();
  }

  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing token' });
  }

  const token = header.slice(7);
  const decoded = jwt.decode(token) as jwt.JwtPayload | null;
  if (!decoded) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  const groups = Array.isArray(decoded.groups) ? decoded.groups.map(String) : [];
  const isAdmin = groups.some((g) => config.azure.adminGroupIds.includes(g));

  req.user = {
    oid: String(decoded.oid ?? decoded.sub ?? ''),
    name: String(decoded.name ?? ''),
    email: String(decoded.preferred_username ?? decoded.upn ?? ''),
    groups,
    isAdmin
  };
  req.accessToken = token;
  next();
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ message: 'Admin only' });
  }
  next();
};
