<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { dashboardApi } from '../api/dashboard';
import DataTable from '../components/common/DataTable.vue';
import StatusBadge from '../components/common/StatusBadge.vue';
import { ShipmentStatus, ShipmentStatusLabel } from '../constants/enums';
import { formatDate } from '../utils/format';

const data = ref<any>(null);
onMounted(async () => { data.value = await dashboardApi.stats(); });
</script>

<template>
  <section v-if="data">
    <div class="page-title"><h2>供应链总览</h2><span>实时业务切片</span></div>
    <div class="cards">
      <article><span>在途运单</span><strong>{{ data.cards.inTransitShipments }}</strong></article>
      <article><span>待签收</span><strong>{{ data.cards.pendingReceiveShipments }}</strong></article>
      <article><span>库存预警</span><strong>{{ data.cards.lowInventoryAlerts }}</strong></article>
      <article><span>活跃供应商</span><strong>{{ data.cards.activeSuppliers }}</strong></article>
    </div>
    <div class="grid two">
      <div class="panel">
        <h3>运单状态分布</h3>
        <div class="bars"><p v-for="item in data.shipmentStatus" :key="item.status"><span>{{ ShipmentStatusLabel[item.status as ShipmentStatus] }}</span><b :style="{ width: `${item.count * 24 + 16}px` }">{{ item.count }}</b></p></div>
      </div>
      <div class="panel">
        <h3>供应商评分分布</h3>
        <div class="bars"><p v-for="item in data.ratingBuckets" :key="item.label"><span>{{ item.label }}</span><b :style="{ width: `${item.count * 32 + 16}px` }">{{ item.count }}</b></p></div>
      </div>
    </div>
    <div class="grid two list-row">
      <div>
        <h3>最近运单</h3>
        <DataTable :columns="[{key:'orderNo',title:'运单编号'},{key:'status',title:'状态'},{key:'createdAt',title:'创建时间'}]" :data="data.recentShipments">
          <template #status="{ row }"><StatusBadge :value="row.status" /></template>
          <template #createdAt="{ row }">{{ formatDate(row.createdAt) }}</template>
        </DataTable>
      </div>
      <div>
        <h3>库存预警</h3>
        <DataTable :columns="[{key:'warehouseName',title:'仓库'},{key:'skuId',title:'SKU'},{key:'quantity',title:'当前数量'},{key:'safetyStock',title:'安全库存'},{key:'alertLevel',title:'级别'}]" :data="data.inventoryAlerts">
          <template #alertLevel="{ row }"><StatusBadge :value="row.alertLevel" /></template>
        </DataTable>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cards { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin-bottom:16px; }
article { background:#fbfcf7; border:1px solid #dbe1e6; border-radius:8px; padding:18px; }
article span { color:#657068; }
article strong { display:block; font-size:34px; margin-top:8px; }
h3 { margin:0 0 14px; }
.bars p { display:grid; grid-template-columns:86px 1fr; align-items:center; gap:10px; margin:10px 0; }
.bars b { display:inline-flex; min-width:34px; height:28px; align-items:center; padding-left:10px; border-radius:4px; background:#cddf89; color:#17241f; }
.list-row { margin-top:18px; }
</style>
