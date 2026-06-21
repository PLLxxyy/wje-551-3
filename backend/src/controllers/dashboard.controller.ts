import type { Request, Response } from 'express';
import { dashboardService } from '../services/dashboard.service.js';
import { ok } from '../utils/response.js';

export class DashboardController {
  stats(_req: Request, res: Response) { res.json(ok(dashboardService.stats())); }
}

export const dashboardController = new DashboardController();
