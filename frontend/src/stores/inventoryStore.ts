import { defineStore } from 'pinia';
import { inventoryApi } from '../api/inventory';
import type { Inventory, Warehouse } from '../types/inventory';

export const useInventoryStore = defineStore('inventory', {
  state: () => ({ warehouses: [] as Warehouse[], inventories: [] as Inventory[], currentWarehouseId: 'wh-east', alerts: [] as Inventory[] }),
  actions: {
    async fetchWarehouses() {
      this.warehouses = await inventoryApi.warehouses() as unknown as Warehouse[];
      this.currentWarehouseId ||= this.warehouses[0]?.id ?? '';
    },
    async fetchInventory(params: Record<string, string> = {}) {
      this.inventories = await inventoryApi.list({ warehouseId: this.currentWarehouseId, ...params }) as unknown as Inventory[];
      this.alerts = this.inventories.filter((item) => item.alertLevel !== 'NORMAL');
    },
  },
});
