import { Router } from 'express';
import { PERMISSIONS } from '../constants/permissions.js';
import { inventoryController } from '../controllers/inventory.controller.js';
import { requirePermission } from '../middlewares/auth.middleware.js';

export const warehouseRoutes = Router();
warehouseRoutes.get('/', requirePermission(PERMISSIONS.INVENTORY_READ), (req, res) => inventoryController.warehouses(req, res));

export const inventoryRoutes = Router();
inventoryRoutes.get('/', requirePermission(PERMISSIONS.INVENTORY_READ), (req, res) => inventoryController.list(req, res));
inventoryRoutes.post('/inbound', requirePermission(PERMISSIONS.INVENTORY_WRITE), (req, res) => inventoryController.inbound(req, res));
inventoryRoutes.post('/outbound', requirePermission(PERMISSIONS.INVENTORY_WRITE), (req, res) => inventoryController.outbound(req, res));
inventoryRoutes.post('/transfer', requirePermission(PERMISSIONS.INVENTORY_WRITE), (req, res) => inventoryController.transfer(req, res));
inventoryRoutes.post('/check', requirePermission(PERMISSIONS.INVENTORY_WRITE), (req, res) => inventoryController.check(req, res));
inventoryRoutes.put('/:id/safety-stock', requirePermission(PERMISSIONS.INVENTORY_WRITE), (req, res) => inventoryController.safety(req, res));
inventoryRoutes.post('/:id/replenishment', requirePermission(PERMISSIONS.SHIPMENT_WRITE), (req, res) => inventoryController.createReplenishment(req, res));
