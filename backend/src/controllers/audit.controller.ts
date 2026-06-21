import type { Request, Response } from 'express';
import { auditService } from '../services/audit.service.js';
import { ok } from '../utils/response.js';

export class AuditController {
  list(req: Request, res: Response) {
    res.json(ok(auditService.list(req.query as Record<string, string | undefined>)));
  }
}

export const auditController = new AuditController();
