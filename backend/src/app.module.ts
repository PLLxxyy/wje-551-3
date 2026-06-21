import type { Express } from 'express';
import { auditRoutes } from './routes/audit.routes.js';
import { authRoutes } from './routes/auth.routes.js';
import { dashboardRoutes } from './routes/dashboard.routes.js';
import { inventoryRoutes, warehouseRoutes } from './routes/inventory.routes.js';
import { shipmentsRoutes } from './routes/shipments.routes.js';
import { suppliersRoutes } from './routes/suppliers.routes.js';

export function registerRoutes(app: Express) {
  app.get('/api/v1/health', (_req, res) => res.json({ code: 0, data: { status: 'ok' } }));
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/suppliers', suppliersRoutes);
  app.use('/api/v1/warehouses', warehouseRoutes);
  app.use('/api/v1/inventory', inventoryRoutes);
  app.use('/api/v1/shipments', shipmentsRoutes);
  app.use('/api/v1/dashboard', dashboardRoutes);
  app.use('/api/v1/audit-logs', auditRoutes);
}
