import { Router } from 'express';
import { PERMISSIONS } from '../constants/permissions.js';
import { auditController } from '../controllers/audit.controller.js';
import { requirePermission } from '../middlewares/auth.middleware.js';

export const auditRoutes = Router();
auditRoutes.get('/', requirePermission(PERMISSIONS.AUDIT_READ), (req, res) => auditController.list(req, res));
