import type { Inventory } from '../types/index.js';
import { InventoryAlertLevel } from '../constants/enums.js';
export type InventoryEntity = Inventory;
export const inventoryAlertLevels = Object.values(InventoryAlertLevel);
