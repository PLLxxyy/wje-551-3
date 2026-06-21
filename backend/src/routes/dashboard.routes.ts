import { Router } from 'express';
import { PERMISSIONS } from '../constants/permissions.js';
import { dashboardController } from '../controllers/dashboard.controller.js';
import { requirePermission } from '../middlewares/auth.middleware.js';

export const dashboardRoutes = Router();
dashboardRoutes.get('/stats', requirePermission(PERMISSIONS.DASHBOARD_READ), (req, res) => dashboardController.stats(req, res));
