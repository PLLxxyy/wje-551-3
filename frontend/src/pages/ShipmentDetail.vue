<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { shipmentsApi } from '../api/shipments';
import DataTable from '../components/common/DataTable.vue';
import StatusBadge from '../components/common/StatusBadge.vue';
import { ShipmentStatus } from '../constants/enums';
import { useShipmentStore } from '../stores/shipmentStore';
import { formatDate } from '../utils/format';

const route = useRoute();
const store = useShipmentStore();
const id = String(route.params.id);
onMounted(() => store.fetchDetail(id));
async function receive() { await shipmentsApi.receive(id); await store.fetchDetail(id); }
async function cancel() { await shipmentsApi.cancel(id); await store.fetchDetail(id); }
</script>

<template>
  <section v-if="store.current">
    <div class="page-title"><h2>{{ store.current.orderNo }}</h2><StatusBadge :value="store.current.status" /></div>
    <div class="grid two">
      <div class="panel">
        <h3>运单信息</h3>
        <p>承运方：{{ store.current.carrier || '-' }}</p>
        <p>追踪号：{{ store.current.trackingNo || '-' }}</p>
        <p>预计到达：{{ formatDate(store.current.estimatedArrival) }}</p>
        <p>备注：{{ store.current.remark || '-' }}</p>
        <button v-if="store.current.status === ShipmentStatus.IN_TRANSIT" class="btn" @click="receive">签收并入库</button>
        <button v-if="store.current.status === ShipmentStatus.PENDING" class="btn secondary" @click="cancel">取消运单</button>
      </div>
      <div class="panel">
        <h3>物流时间线</h3>
        <p v-for="event in store.current.timeline" :key="event.id"><StatusBadge :value="event.status" /> {{ event.note }} · {{ event.operator }} · {{ formatDate(event.createdAt) }}</p>
      </div>
    </div>
    <h3>运单明细</h3>
    <DataTable :columns="[{key:'skuId',title:'SKU'},{key:'skuName',title:'名称'},{key:'quantity',title:'数量'}]" :data="store.current.items as any" />
  </section>
</template>
