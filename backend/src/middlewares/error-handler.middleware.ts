import type { NextFunction, Request, Response } from 'express';
import { appendFile } from 'node:fs/promises';
import { BusinessException } from '../utils/response.js';

export async function errorHandlerMiddleware(error: Error, _req: Request, res: Response, _next: NextFunction) {
  const isBusiness = error instanceof BusinessException;
  const status = isBusiness ? error.status : 500;
  const message = isBusiness ? error.message : '服务器异常，请稍后重试';
  await appendFile('error.log', `[${new Date().toISOString()}] ${error.stack ?? error.message}\n`).catch(() => undefined);
  res.status(status).json({ code: status, message, details: isBusiness ? error.details : undefined });
}
