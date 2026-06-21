import type { ShipmentStatus } from '../constants/enums';
import type { Supplier } from './supplier';
import type { Warehouse } from './inventory';

export interface ShipmentItem {
  id: string;
  shipmentId: string;
  skuId: string;
  skuName: string;
  quantity: number;
}

export interface TimelineEvent {
  id: string;
  status: ShipmentStatus;
  operator: string;
  note: string;
  createdAt: string;
}

export interface Shipment {
  id: string;
  orderNo: string;
  supplierId: string;
  warehouseId: string;
  status: ShipmentStatus;
  trackingNo: string;
  carrier: string;
  estimatedArrival: string;
  actualArrival?: string;
  remark: string;
  items: ShipmentItem[];
  timeline: TimelineEvent[];
  supplier?: Supplier;
  warehouse?: Warehouse;
  createdAt: string;
  updatedAt: string;
}
