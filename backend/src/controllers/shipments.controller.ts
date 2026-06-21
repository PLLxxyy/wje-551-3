import type { Request, Response } from 'express';
import { resLocals } from '../middlewares/auth.middleware.js';
import { shipmentsService } from '../services/shipments.service.js';
import { ok } from '../utils/response.js';

export class ShipmentsController {
  list(req: Request, res: Response) { res.json(ok(shipmentsService.list(req.query as Record<string, string | undefined>))); }
  detail(req: Request, res: Response) { res.json(ok(shipmentsService.detail(req.params.id))); }
  create(req: Request, res: Response) { res.json(ok(shipmentsService.create(req.body, resLocals(req).user))); }
  ship(req: Request, res: Response) { res.json(ok(shipmentsService.ship(req.params.id, req.body, resLocals(req).user))); }
  transit(req: Request, res: Response) { res.json(ok(shipmentsService.transit(req.params.id, resLocals(req).user))); }
  receive(req: Request, res: Response) { res.json(ok(shipmentsService.receive(req.params.id, resLocals(req).user))); }
  exception(req: Request, res: Response) { res.json(ok(shipmentsService.exception(req.params.id, req.body.reason, resLocals(req).user))); }
  cancel(req: Request, res: Response) { res.json(ok(shipmentsService.cancel(req.params.id, resLocals(req).user))); }
}

export const shipmentsController = new ShipmentsController();
