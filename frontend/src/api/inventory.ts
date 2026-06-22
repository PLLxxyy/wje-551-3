import { request } from './request';
import type { Inventory, Warehouse } from '../types/inventory';

export const inventoryApi = {
  warehouses: () => request.get<Warehouse[]>('/warehouses'),
  list: (params?: Record<string, string>) => request.get<Inventory[]>('/inventory', { params }),
  inbound: (payload: unknown) => request.post('/inventory/inbound', payload),
  outbound: (payload: unknown) => request.post('/inventory/outbound', payload),
  transfer: (payload: unknown) => request.post('/inventory/transfer', payload),
  check: (payload: unknown) => request.post('/inventory/check', payload),
  safety: (id: string, safetyStock: number) => request.put(`/inventory/${id}/safety-stock`, { safetyStock }),
  createReplenishment: (id: string, supplierId: string) => request.post(`/inventory/${id}/replenishment`, { supplierId }),
};
