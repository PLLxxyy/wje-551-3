import { defineStore } from 'pinia';
import { shipmentsApi } from '../api/shipments';
import type { Shipment } from '../types/shipment';

export const useShipmentStore = defineStore('shipment', {
  state: () => ({ shipments: [] as Shipment[], current: null as Shipment | null, statusStats: [] as Array<{ status: string; count: number }> }),
  actions: {
    async fetchList(params: Record<string, string> = {}) {
      this.shipments = await shipmentsApi.list(params) as unknown as Shipment[];
    },
    async fetchDetail(id: string) {
      this.current = await shipmentsApi.detail(id) as unknown as Shipment;
    },
  },
});
