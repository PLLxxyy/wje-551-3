import type { Request, Response } from 'express';
import { resLocals } from '../middlewares/auth.middleware.js';
import { suppliersService } from '../services/suppliers.service.js';
import { ok } from '../utils/response.js';

export class SuppliersController {
  list(req: Request, res: Response) { res.json(ok(suppliersService.list(req.query as Record<string, string | undefined>))); }
  detail(req: Request, res: Response) { res.json(ok(suppliersService.detail(req.params.id))); }
  create(req: Request, res: Response) { res.json(ok(suppliersService.create(req.body, resLocals(req).user))); }
  update(req: Request, res: Response) { res.json(ok(suppliersService.update(req.params.id, req.body, resLocals(req).user))); }
  review(req: Request, res: Response) { res.json(ok(suppliersService.review(req.params.id, Boolean(req.body.approved), resLocals(req).user))); }
  rating(req: Request, res: Response) { res.json(ok(suppliersService.rate(req.params.id, Number(req.body.score), Number(req.body.weight ?? 1), req.body.remark ?? '', resLocals(req).user))); }
}

export const suppliersController = new SuppliersController();
