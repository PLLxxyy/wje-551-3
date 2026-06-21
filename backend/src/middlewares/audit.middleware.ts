import type { NextFunction, Request, Response } from 'express';

export function auditMiddleware(req: Request, res: Response, next: NextFunction) {
  res.setHeader('X-Audit-Trace', `${req.method}:${req.path}`);
  next();
}
