import { v4 as uuid } from 'uuid';
import { InventoryAlertLevel, ShipmentStatus, SupplierStatus } from '../constants/enums.js';
import { inventories, shipments, suppliers, warehouses } from '../database/seeds/initial.js';
import type { Shipment, ShipmentItemInput, User } from '../types/index.js';
import { auditService } from './audit.service.js';
import { inventoryService } from './inventory.service.js';
import { BusinessException } from '../utils/response.js';

function nextOrderNo() {
  const date = new Date().toISOString().slice(0, 10).replaceAll('-', '');
  return `SHIP-${date}-${String(shipments.length + 1).padStart(4, '0')}`;
}

export class ShipmentsService {
  list(query: Record<string, string | undefined>) {
    return shipments
      .filter((item) => !query.orderNo || item.orderNo.includes(query.orderNo))
      .filter((item) => !query.status || item.status === query.status)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  detail(id: string) {
    const shipment = shipments.find((item) => item.id === id);
    if (!shipment) throw new BusinessException(404, '运单不存在');
    return {
      ...shipment,
      supplier: suppliers.find((item) => item.id === shipment.supplierId),
      warehouse: warehouses.find((item) => item.id === shipment.warehouseId),
    };
  }

  create(payload: { supplierId: string; warehouseId: string; items: ShipmentItemInput[]; estimatedArrival: string; remark?: string }, user?: User) {
    const supplier = suppliers.find((item) => item.id === payload.supplierId);
    if (!supplier) throw new BusinessException(404, '供应商不存在');
    if (supplier.status === SupplierStatus.BLACKLISTED) throw new BusinessException(400, '黑名单供应商不能创建新的运单');
    const warehouse = warehouses.find((item) => item.id === payload.warehouseId);
    if (!warehouse) throw new BusinessException(404, '仓库不存在');
    const now = new Date().toISOString();
    const shipmentId = uuid();
    const shipment: Shipment = {
      id: shipmentId,
      orderNo: nextOrderNo(),
      supplierId: payload.supplierId,
      warehouseId: payload.warehouseId,
      status: ShipmentStatus.PENDING,
      trackingNo: '',
      carrier: '',
      estimatedArrival: payload.estimatedArrival,
      remark: payload.remark ?? '',
      items: payload.items.map((item) => ({ ...item, id: uuid(), shipmentId })),
      timeline: [{ id: uuid(), status: ShipmentStatus.PENDING, operator: user?.name ?? '系统', note: '创建运单', createdAt: now }],
      resolvedAlertIds: [],
      createdAt: now,
      updatedAt: now,
    };
    shipments.unshift(shipment);
    auditService.record({ action: 'CREATE', module: 'SHIPMENT', targetId: shipment.id, targetName: shipment.orderNo, detail: shipment }, user);
    return shipment;
  }

  ship(id: string, payload: { trackingNo: string; carrier: string }, user?: User) {
    const shipment = this.requireStatus(id, [ShipmentStatus.PENDING]);
    shipment.trackingNo = payload.trackingNo;
    shipment.carrier = payload.carrier;
    return this.transition(shipment, ShipmentStatus.SHIPPED, '发货', user);
  }

  transit(id: string, user?: User) {
    return this.transition(this.requireStatus(id, [ShipmentStatus.SHIPPED, ShipmentStatus.EXCEPTION]), ShipmentStatus.IN_TRANSIT, '在途更新', user);
  }

  receive(id: string, user?: User) {
    const shipment = this.requireStatus(id, [ShipmentStatus.IN_TRANSIT]);
    shipment.items.forEach((item) => inventoryService.inbound({ warehouseId: shipment.warehouseId, skuId: item.skuId, skuName: item.skuName, quantity: item.quantity }, user));
    shipment.actualArrival = new Date().toISOString();
    const resolvedAlerts = this.resolveInventoryAlerts(shipment, user);
    shipment.resolvedAlertIds = resolvedAlerts;
    return this.transition(shipment, ShipmentStatus.DELIVERED, '签收并自动入库，自动冲销预警', user);
  }

  private resolveInventoryAlerts(shipment: Shipment, user?: User): string[] {
    const resolvedIds: string[] = [];
    shipment.items.forEach((item) => {
      const inventory = inventories.find((inv) => inv.warehouseId === shipment.warehouseId && inv.skuId === item.skuId);
      if (inventory && inventory.linkedShipmentIds.includes(shipment.id)) {
        inventory.resolvedByShipmentId = shipment.id;
        resolvedIds.push(inventory.id);
        auditService.record({ action: 'UPDATE', module: 'INVENTORY', targetId: inventory.id, targetName: inventory.skuId, detail: { type: 'ALERT_RESOLVED', shipmentId: shipment.id, shipmentOrderNo: shipment.orderNo } }, user);
      }
    });
    return resolvedIds;
  }

  exception(id: string, reason: string, user?: User) {
    const shipment = this.requireStatus(id, [ShipmentStatus.PENDING, ShipmentStatus.SHIPPED, ShipmentStatus.IN_TRANSIT]);
    shipment.remark = reason;
    return this.transition(shipment, ShipmentStatus.EXCEPTION, reason, user);
  }

  cancel(id: string, user?: User) {
    const shipment = this.requireStatus(id, [ShipmentStatus.PENDING]);
    shipment.items.forEach((item) => {
      const inventory = inventories.find((inv) => inv.warehouseId === shipment.warehouseId && inv.skuId === item.skuId);
      if (inventory) {
        inventory.linkedShipmentIds = inventory.linkedShipmentIds.filter((sid) => sid !== shipment.id);
      }
    });
    return this.transition(shipment, ShipmentStatus.CANCELLED, '取消运单', user);
  }

  private requireStatus(id: string, allowed: ShipmentStatus[]) {
    const shipment = shipments.find((item) => item.id === id);
    if (!shipment) throw new BusinessException(404, '运单不存在');
    if (!allowed.includes(shipment.status)) throw new BusinessException(400, `当前状态${shipment.status}不允许该操作`);
    return shipment;
  }

  private transition(shipment: Shipment, status: ShipmentStatus, note: string, user?: User) {
    const before = shipment.status;
    shipment.status = status;
    shipment.updatedAt = new Date().toISOString();
    shipment.timeline.unshift({ id: uuid(), status, operator: user?.name ?? '系统', note, createdAt: shipment.updatedAt });
    auditService.record({ action: 'STATUS_CHANGE', module: 'SHIPMENT', targetId: shipment.id, targetName: shipment.orderNo, detail: { before, after: status, note } }, user);
    return shipment;
  }
}

export const shipmentsService = new ShipmentsService();
