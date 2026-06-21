import { Router } from 'express';
import { PERMISSIONS } from '../constants/permissions.js';
import { shipmentsController } from '../controllers/shipments.controller.js';
import { requirePermission } from '../middlewares/auth.middleware.js';

export const shipmentsRoutes = Router();
shipmentsRoutes.get('/', requirePermission(PERMISSIONS.SHIPMENT_READ), (req, res) => shipmentsController.list(req, res));
shipmentsRoutes.post('/', requirePermission(PERMISSIONS.SHIPMENT_WRITE), (req, res) => shipmentsController.create(req, res));
shipmentsRoutes.get('/:id', requirePermission(PERMISSIONS.SHIPMENT_READ), (req, res) => shipmentsController.detail(req, res));
shipmentsRoutes.post('/:id/ship', requirePermission(PERMISSIONS.SHIPMENT_WRITE), (req, res) => shipmentsController.ship(req, res));
shipmentsRoutes.post('/:id/transit', requirePermission(PERMISSIONS.SHIPMENT_WRITE), (req, res) => shipmentsController.transit(req, res));
shipmentsRoutes.post('/:id/receive', requirePermission(PERMISSIONS.SHIPMENT_RECEIVE), (req, res) => shipmentsController.receive(req, res));
shipmentsRoutes.post('/:id/exception', requirePermission(PERMISSIONS.SHIPMENT_WRITE), (req, res) => shipmentsController.exception(req, res));
shipmentsRoutes.post('/:id/cancel', requirePermission(PERMISSIONS.SHIPMENT_WRITE), (req, res) => shipmentsController.cancel(req, res));
