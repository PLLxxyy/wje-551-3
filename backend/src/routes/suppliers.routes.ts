import { Router } from 'express';
import { PERMISSIONS } from '../constants/permissions.js';
import { suppliersController } from '../controllers/suppliers.controller.js';
import { requirePermission } from '../middlewares/auth.middleware.js';

export const suppliersRoutes = Router();
suppliersRoutes.get('/', requirePermission(PERMISSIONS.SUPPLIER_READ), (req, res) => suppliersController.list(req, res));
suppliersRoutes.post('/', requirePermission(PERMISSIONS.SUPPLIER_WRITE), (req, res) => suppliersController.create(req, res));
suppliersRoutes.get('/:id', requirePermission(PERMISSIONS.SUPPLIER_READ), (req, res) => suppliersController.detail(req, res));
suppliersRoutes.put('/:id', requirePermission(PERMISSIONS.SUPPLIER_WRITE), (req, res) => suppliersController.update(req, res));
suppliersRoutes.post('/:id/review', requirePermission(PERMISSIONS.SUPPLIER_WRITE), (req, res) => suppliersController.review(req, res));
suppliersRoutes.post('/:id/rating', requirePermission(PERMISSIONS.SUPPLIER_WRITE), (req, res) => suppliersController.rating(req, res));
