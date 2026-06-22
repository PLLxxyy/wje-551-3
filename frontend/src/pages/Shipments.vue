<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { shipmentsApi } from '../api/shipments';
import DataTable from '../components/common/DataTable.vue';
import StatusBadge from '../components/common/StatusBadge.vue';
import { ShipmentStatus } from '../constants/enums';
import { PERMISSIONS } from '../constants/permissions';
import { useShipmentStore } from '../stores/shipmentStore';
import { formatDate } from '../utils/format';

const store = useShipmentStore();
const orderNo = ref('');
const status = ref('');
onMounted(() => store.fetchList());
async function reload() { await store.fetchList({ orderNo: orderNo.value, status: status.value }); }
async function ship(id: string) { await shipmentsApi.ship(id, { trackingNo: `TRK${Date.now()}`, carrier: '顺丰速运' }); await reload(); }
async function transit(id: string) { await shipmentsApi.transit(id); await reload(); }
async function receive(id: string) { await shipmentsApi.receive(id); await reload(); }
async function exception(id: string) { await shipmentsApi.exception(id, '人工标记异常'); await reload(); }
</script>

<template>
  <section>
    <div class="page-title"><h2>运单追踪</h2><button v-permission="PERMISSIONS.SHIPMENT_WRITE" class="btn">新建运单</button></div>
    <div class="toolbar">
      <input v-model="orderNo" placeholder="运单编号" @input="reload" />
      <select v-model="status" @change="reload"><option value="">全部状态</option><option v-for="item in Object.values(ShipmentStatus)" :key="item" :value="item">{{ item }}</option></select>
    </div>
    <DataTable :columns="[{key:'orderNo',title:'运单编号'},{key:'supplierId',title:'供应商'},{key:'warehouseId',title:'目标仓'},{key:'status',title:'状态'},{key:'carrier',title:'承运方'},{key:'estimatedArrival',title:'预计到达'},{key:'createdAt',title:'创建时间'}]" :data="store.shipments as any">
      <template #status="{ row }"><StatusBadge :value="row.status" /></template>
      <template #estimatedArrival="{ row }">{{ formatDate(row.estimatedArrival) }}</template>
      <template #createdAt="{ row }">{{ formatDate(row.createdAt) }}</template>
      <template #actions="{ row }">
        <RouterLink class="link" :to="`/shipments/${row.id}`">详情</RouterLink>
        <button v-if="row.status === ShipmentStatus.PENDING" v-permission="PERMISSIONS.SHIPMENT_WRITE" class="mini" @click="ship(row.id)">发货</button>
        <button v-if="[ShipmentStatus.SHIPPED, ShipmentStatus.EXCEPTION].includes(row.status)" v-permission="PERMISSIONS.SHIPMENT_WRITE" class="mini" @click="transit(row.id)">在途</button>
        <button v-if="row.status === ShipmentStatus.IN_TRANSIT" v-permission="PERMISSIONS.SHIPMENT_RECEIVE" class="mini" @click="receive(row.id)">签收</button>
        <button v-if="![ShipmentStatus.DELIVERED, ShipmentStatus.CANCELLED].includes(row.status)" v-permission="PERMISSIONS.SHIPMENT_WRITE" class="mini" @click="exception(row.id)">异常</button>
      </template>
    </DataTable>
  </section>
</template>

<style scoped>
.link { color:#175c4a; font-weight:800; margin-right:8px; }
.mini { margin-right:5px; border:0; border-radius:5px; padding:5px 8px; background:#e1e8d0; cursor:pointer; }
</style>
