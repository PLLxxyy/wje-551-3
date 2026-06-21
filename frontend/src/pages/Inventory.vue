<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { inventoryApi } from '../api/inventory';
import DataTable from '../components/common/DataTable.vue';
import StatusBadge from '../components/common/StatusBadge.vue';
import WarehouseSelector from '../components/common/WarehouseSelector.vue';
import { PERMISSIONS } from '../constants/permissions';
import { useInventoryStore } from '../stores/inventoryStore';
import { formatDate } from '../utils/format';

const store = useInventoryStore();
const keyword = ref('');
onMounted(async () => { await store.fetchWarehouses(); await store.fetchInventory(); });
async function reload() { await store.fetchInventory({ keyword: keyword.value }); }
async function inbound(row: any) { await inventoryApi.inbound({ warehouseId: row.warehouseId, skuId: row.skuId, skuName: row.skuName, quantity: 10 }); await reload(); }
async function outbound(row: any) { await inventoryApi.outbound({ warehouseId: row.warehouseId, skuId: row.skuId, quantity: 5 }); await reload(); }
</script>

<template>
  <section>
    <div class="page-title"><h2>库存管理</h2><div><button class="btn secondary">调拨</button> <button class="btn secondary">盘点</button></div></div>
    <div class="toolbar">
      <WarehouseSelector v-model="store.currentWarehouseId" @change="reload" />
      <input v-model="keyword" placeholder="SKU 搜索" @input="reload" />
    </div>
    <DataTable :columns="[{key:'skuId',title:'SKU 编码'},{key:'skuName',title:'SKU 名称'},{key:'quantity',title:'当前数量'},{key:'safetyStock',title:'安全库存'},{key:'alertLevel',title:'预警级别'},{key:'updatedAt',title:'最后更新时间'}]" :data="store.inventories as any">
      <template #alertLevel="{ row }"><StatusBadge :value="row.alertLevel" /></template>
      <template #updatedAt="{ row }">{{ formatDate(row.updatedAt) }}</template>
      <template #actions="{ row }">
        <button v-permission="PERMISSIONS.INVENTORY_WRITE" class="mini" @click="inbound(row)">入库+10</button>
        <button v-permission="PERMISSIONS.INVENTORY_WRITE" class="mini" @click="outbound(row)">出库-5</button>
      </template>
    </DataTable>
  </section>
</template>

<style scoped>.mini { margin-right:6px; border:0; border-radius:5px; padding:5px 8px; background:#e1e8d0; cursor:pointer; }</style>
