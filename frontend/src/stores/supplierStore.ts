import { defineStore } from 'pinia';
import { suppliersApi } from '../api/suppliers';
import type { Supplier } from '../types/supplier';

export const useSupplierStore = defineStore('supplier', {
  state: () => ({ suppliers: [] as Supplier[], current: null as Supplier | null, filters: { name: '', status: '' } }),
  actions: {
    async fetchList() {
      this.suppliers = await suppliersApi.list(this.filters) as unknown as Supplier[];
    },
    async fetchDetail(id: string) {
      this.current = await suppliersApi.detail(id) as unknown as Supplier;
    },
  },
});
