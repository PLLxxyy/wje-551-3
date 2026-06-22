<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { inventoryApi } from '../api/inventory';
import { suppliersApi } from '../api/suppliers';
import DataTable from '../components/common/DataTable.vue';
import StatusBadge from '../components/common/StatusBadge.vue';
import WarehouseSelector from '../components/common/WarehouseSelector.vue';
import { InventoryAlertLevel, SupplierStatus } from '../constants/enums';
import { PERMISSIONS } from '../constants/permissions';
import { useInventoryStore } from '../stores/inventoryStore';
import { useSupplierStore } from '../stores/supplierStore';
import { formatDate } from '../utils/format';
import type { Inventory } from '../types/inventory';
import type { Supplier } from '../types/supplier';

const store = useInventoryStore();
const supplierStore = useSupplierStore();
const keyword = ref('');
const showSupplierDialog = ref(false);
const selectedInventory = ref<Inventory | null>(null);
const selectedSupplierId = ref('');

onMounted(async () => {
  await store.fetchWarehouses();
  await store.fetchInventory();
  await supplierStore.fetchList();
});

async function reload() {
  await store.fetchInventory({ keyword: keyword.value });
}

const activeSuppliers = computed(() => {
  return supplierStore.suppliers.filter((s: Supplier) => s.status === SupplierStatus.ACTIVE);
});

function isAlert(row: Inventory) {
  return row.alertLevel !== InventoryAlertLevel.NORMAL && !row.resolvedByShipmentId;
}

function isResolved(row: Inventory) {
  return !!row.resolvedByShipmentId;
}

function hasPendingReplenishment(row: Inventory) {
  return row.linkedShipmentIds && row.linkedShipmentIds.length > 0 && !row.resolvedByShipmentId;
}

function canReplenish(row: Inventory) {
  return isAlert(row) && !hasPendingReplenishment(row);
}

function openReplenishmentDialog(row: Inventory) {
  selectedInventory.value = row;
  selectedSupplierId.value = activeSuppliers.value[0]?.id || '';
  showSupplierDialog.value = true;
}

async function confirmReplenishment() {
  if (!selectedInventory.value || !selectedSupplierId.value) return;
  try {
    await inventoryApi.createReplenishment(selectedInventory.value.id, selectedSupplierId.value);
    showSupplierDialog.value = false;
    selectedInventory.value = null;
    await reload();
  } catch (error) {
    console.error('创建补货订单失败', error);
  }
}

async function inbound(row: Inventory) {
  await inventoryApi.inbound({ warehouseId: row.warehouseId, skuId: row.skuId, skuName: row.skuName, quantity: 10 });
  await reload();
}

async function outbound(row: Inventory) {
  await inventoryApi.outbound({ warehouseId: row.warehouseId, skuId: row.skuId, quantity: 5 });
  await reload();
}
</script>

<template>
  <section>
    <div class="page-title">
      <h2>库存管理</h2>
      <div>
        <button class="btn secondary">调拨</button>
        <button class="btn secondary">盘点</button>
      </div>
    </div>
    <div class="toolbar">
      <WarehouseSelector v-model="store.currentWarehouseId" @change="reload" />
      <input v-model="keyword" placeholder="SKU 搜索" @input="reload" />
    </div>
    <DataTable
      :columns="[
        { key: 'skuId', title: 'SKU 编码' },
        { key: 'skuName', title: 'SKU 名称' },
        { key: 'quantity', title: '当前数量' },
        { key: 'safetyStock', title: '安全库存' },
        { key: 'alertLevel', title: '预警级别' },
        { key: 'updatedAt', title: '最后更新时间' }
      ]"
      :data="store.inventories as any"
    >
      <template #alertLevel="{ row }">
        <StatusBadge v-if="!isResolved(row)" :value="row.alertLevel" />
        <span v-else class="resolved-badge">已冲销</span>
        <span v-if="hasPendingReplenishment(row)" class="replenish-tag">补货中</span>
        <span v-if="isResolved(row)" class="resolved-tag">已完成</span>
      </template>
      <template #updatedAt="{ row }">{{ formatDate(row.updatedAt) }}</template>
      <template #actions="{ row }">
        <template v-if="isAlert(row)">
          <button
            v-permission="PERMISSIONS.SHIPMENT_WRITE"
            class="mini replenish"
            :disabled="!canReplenish(row)"
            @click="openReplenishmentDialog(row)"
          >
            {{ hasPendingReplenishment(row) ? '补货进行中' : '一键补货' }}
          </button>
        </template>
        <template v-else>
          <button v-permission="PERMISSIONS.INVENTORY_WRITE" class="mini" @click="inbound(row)">入库+10</button>
          <button v-permission="PERMISSIONS.INVENTORY_WRITE" class="mini" @click="outbound(row)">出库-5</button>
        </template>
      </template>
    </DataTable>

    <div v-if="showSupplierDialog" class="dialog-overlay" @click.self="showSupplierDialog = false">
      <div class="dialog">
        <h3>创建补货订单</h3>
        <div class="dialog-content">
          <div class="info-row">
            <label>SKU：</label>
            <span>{{ selectedInventory?.skuId }} - {{ selectedInventory?.skuName }}</span>
          </div>
          <div class="info-row">
            <label>当前库存：</label>
            <span>{{ selectedInventory?.quantity }}</span>
          </div>
          <div class="info-row">
            <label>安全库存：</label>
            <span>{{ selectedInventory?.safetyStock }}</span>
          </div>
          <div class="info-row">
            <label>建议补货量：</label>
            <span>{{ Math.max((selectedInventory?.safetyStock || 0) - (selectedInventory?.quantity || 0), Math.ceil((selectedInventory?.safetyStock || 0) * 0.5)) }}</span>
          </div>
          <div class="form-row">
            <label>选择供应商：</label>
            <select v-model="selectedSupplierId">
              <option v-for="supplier in activeSuppliers" :key="supplier.id" :value="supplier.id">
                {{ supplier.name }}
              </option>
            </select>
          </div>
        </div>
        <div class="dialog-actions">
          <button class="btn secondary" @click="showSupplierDialog = false">取消</button>
          <button class="btn primary" @click="confirmReplenishment" :disabled="!selectedSupplierId">确认创建</button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.mini {
  margin-right: 6px;
  border: 0;
  border-radius: 5px;
  padding: 5px 8px;
  background: #e1e8d0;
  cursor: pointer;
}
.mini.replenish {
  background: #fff3e0;
  color: #e65100;
}
.mini.replenish:disabled {
  background: #f5f5f5;
  color: #9e9e9e;
  cursor: not-allowed;
}
.replenish-tag {
  margin-left: 8px;
  padding: 2px 6px;
  background: #fff3e0;
  color: #e65100;
  border-radius: 4px;
  font-size: 12px;
}
.resolved-badge {
  display: inline-block;
  padding: 2px 8px;
  background: #e8f5e9;
  color: #2e7d32;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 500;
}
.resolved-tag {
  margin-left: 8px;
  padding: 2px 6px;
  background: #e8f5e9;
  color: #2e7d32;
  border-radius: 4px;
  font-size: 12px;
}
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.dialog {
  background: white;
  border-radius: 8px;
  padding: 24px;
  min-width: 400px;
  max-width: 500px;
}
.dialog h3 {
  margin: 0 0 16px 0;
}
.dialog-content {
  margin-bottom: 20px;
}
.info-row {
  display: flex;
  margin-bottom: 12px;
}
.info-row label {
  width: 100px;
  color: #666;
}
.info-row span {
  flex: 1;
  font-weight: 500;
}
.form-row {
  display: flex;
  align-items: center;
  margin-top: 16px;
}
.form-row label {
  width: 100px;
  color: #666;
}
.form-row select {
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
