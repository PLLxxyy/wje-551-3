import type { Shipment } from '../types/index.js';
import { ShipmentStatus } from '../constants/enums.js';
export type ShipmentEntity = Shipment;
export const shipmentStatuses = Object.values(ShipmentStatus);
