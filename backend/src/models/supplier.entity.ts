import type { Supplier } from '../types/index.js';
import { SupplierStatus } from '../constants/enums.js';
export type SupplierEntity = Supplier;
export const supplierStatuses = Object.values(SupplierStatus);
