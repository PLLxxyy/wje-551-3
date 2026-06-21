import type { Request, Response } from 'express';
import { resLocals } from '../middlewares/auth.middleware.js';
import { inventoryService } from '../services/inventory.service.js';
import { ok } from '../utils/response.js';

export class InventoryController {
  warehouses(_req: Request, res: Response) { res.json(ok(inventoryService.warehouses())); }
  list(req: Request, res: Response) { res.json(ok(inventoryService.list(req.query as Record<string, string | undefined>))); }
  inbound(req: Request, res: Response) { res.json(ok(inventoryService.inbound(req.body, resLocals(req).user))); }
  outbound(req: Request, res: Response) { res.json(ok(inventoryService.outbound(req.body, resLocals(req).user))); }
  transfer(req: Request, res: Response) { res.json(ok(inventoryService.transfer(req.body, resLocals(req).user))); }
  check(req: Request, res: Response) { res.json(ok(inventoryService.check(req.body, resLocals(req).user))); }
  safety(req: Request, res: Response) { res.json(ok(inventoryService.updateSafetyStock(req.params.id, Number(req.body.safetyStock), resLocals(req).user))); }
}

export const inventoryController = new InventoryController();
