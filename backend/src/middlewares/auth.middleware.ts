import type { NextFunction, Request, Response } from 'express';
import { authService } from '../services/auth.service.js';
import { BusinessException } from '../utils/response.js';

export function authMiddleware(req: Request, _res: Response, next: NextFunction) {
  if (req.path.endsWith('/auth/login') || req.path.endsWith('/health')) return next();
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return next(new BusinessException(401, '未登录'));
  try {
    resLocals(req).user = authService.verify(token);
    next();
  } catch {
    next(new BusinessException(401, '登录已失效'));
  }
}

export function requirePermission(permission: string) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const user = resLocals(req).user;
    if (!user?.permissions.includes(permission)) return next(new BusinessException(403, '无权限执行此操作'));
    next();
  };
}

export function resLocals(req: Request) {
  return req as Request & { user?: ReturnType<typeof authService.verify> };
}
