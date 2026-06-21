import { v4 as uuid } from 'uuid';
import { InventoryAlertLevel } from '../constants/enums.js';
import { inventories, warehouses } from '../database/seeds/initial.js';
import type { Inventory, User } from '../types/index.js';
import { auditService } from './audit.service.js';
import { BusinessException } from '../utils/response.js';
import { assertPositiveInteger, assertRequired } from '../utils/validation.js';

export function calculateAlertLevel(quantity: number, safetyStock: number) {
  if (quantity <= safetyStock * 0.5) return InventoryAlertLevel.CRITICAL;
  if (quantity <= safetyStock) return InventoryAlertLevel.LOW;
  return InventoryAlertLevel.NORMAL;
}

export class InventoryService {
  warehouses() {
    return warehouses;
  }

  list(query: Record<string, string | undefined>) {
    return inventories
      .filter((item) => !query.warehouseId || item.warehouseId === query.warehouseId)
      .filter((item) => !query.keyword || item.skuId.includes(query.keyword) || item.skuName.includes(query.keyword))
      .filter((item) => !query.alertLevel || item.alertLevel === query.alertLevel);
  }

  findOrCreate(warehouseId: string, skuId: string, skuName: string) {
    let inventory = inventories.find((item) => item.warehouseId === warehouseId && item.skuId === skuId);
    if (!inventory) {
      inventory = { id: uuid(), warehouseId, skuId, skuName, quantity: 0, safetyStock: 20, alertLevel: InventoryAlertLevel.CRITICAL, updatedAt: new Date().toISOString() };
      inventories.push(inventory);
    }
    return inventory;
  }

  inbound(payload: { warehouseId: string; skuId: string; skuName: string; quantity: number }, user?: User) {
    assertRequired(payload.warehouseId, '仓库');
    assertRequired(payload.skuId, 'SKU');
    assertPositiveInteger(Number(payload.quantity), '入库数量');
    const inventory = this.findOrCreate(payload.warehouseId, payload.skuId, payload.skuName);
    inventory.quantity += Number(payload.quantity);
    this.refresh(inventory);
    auditService.record({ action: 'UPDATE', module: 'INVENTORY', targetId: inventory.id, targetName: inventory.skuId, detail: { type: 'INBOUND', quantity: payload.quantity } }, user);
    return inventory;
  }

  outbound(payload: { warehouseId: string; skuId: string; quantity: number }, user?: User) {
    assertPositiveInteger(Number(payload.quantity), '出库数量');
    const inventory = inventories.find((item) => item.warehouseId === payload.warehouseId && item.skuId === payload.skuId);
    if (!inventory) throw new BusinessException(404, '库存不存在');
    if (inventory.quantity < Number(payload.quantity)) throw new BusinessException(400, '出库数量不能超过当前库存');
    inventory.quantity -= Number(payload.quantity);
    this.refresh(inventory);
    auditService.record({ action: 'UPDATE', module: 'INVENTORY', targetId: inventory.id, targetName: inventory.skuId, detail: { type: 'OUTBOUND', quantity: payload.quantity } }, user);
    return inventory;
  }

  transfer(payload: { sourceWarehouseId: string; targetWarehouseId: string; skuId: string; quantity: number }, user?: User) {
    const source = inventories.find((item) => item.warehouseId === payload.sourceWarehouseId && item.skuId === payload.skuId);
    if (!source) throw new BusinessException(404, '源库存不存在');
    const before = source.quantity;
    this.outbound({ warehouseId: payload.sourceWarehouseId, skuId: payload.skuId, quantity: payload.quantity }, user);
    try {
      const target = this.inbound({ warehouseId: payload.targetWarehouseId, skuId: payload.skuId, skuName: source.skuName, quantity: payload.quantity }, user);
      auditService.record({ action: 'UPDATE', module: 'INVENTORY', targetId: source.id, targetName: source.skuId, detail: { type: 'TRANSFER', payload } }, user);
      return { source, target };
    } catch (error) {
      source.quantity = before;
      this.refresh(source);
      throw error;
    }
  }

  check(payload: { warehouseId: string; adjustments: Array<{ skuId: string; actualQuantity: number }> }, user?: User) {
    const report = payload.adjustments.map((adjustment) => {
      const inventory = inventories.find((item) => item.warehouseId === payload.warehouseId && item.skuId === adjustment.skuId);
      if (!inventory) throw new BusinessException(404, `库存${adjustment.skuId}不存在`);
      const before = inventory.quantity;
      inventory.quantity = Number(adjustment.actualQuantity);
      this.refresh(inventory);
      return { skuId: adjustment.skuId, before, after: inventory.quantity, diff: inventory.quantity - before };
    });
    auditService.record({ action: 'UPDATE', module: 'INVENTORY', targetId: payload.warehouseId, targetName: '库存盘点', detail: { type: 'CHECK', report } }, user);
    return report;
  }

  updateSafetyStock(id: string, safetyStock: number, user?: User) {
    const inventory = inventories.find((item) => item.id === id);
    if (!inventory) throw new BusinessException(404, '库存不存在');
    inventory.safetyStock = Number(safetyStock);
    this.refresh(inventory);
    auditService.record({ action: 'UPDATE', module: 'INVENTORY', targetId: id, targetName: inventory.skuId, detail: { safetyStock } }, user);
    return inventory;
  }

  private refresh(inventory: Inventory) {
    inventory.alertLevel = calculateAlertLevel(inventory.quantity, inventory.safetyStock);
    inventory.updatedAt = new Date().toISOString();
  }
}

export const inventoryService = new InventoryService();
