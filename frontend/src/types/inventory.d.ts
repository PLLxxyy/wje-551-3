import type { InventoryAlertLevel } from '../constants/enums';

export interface Warehouse {
  id: string;
  name: string;
  address: string;
  capacity: number;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

export interface Inventory {
  id: string;
  warehouseId: string;
  warehouseName?: string;
  skuId: string;
  skuName: string;
  quantity: number;
  safetyStock: number;
  alertLevel: InventoryAlertLevel;
  updatedAt: string;
}
