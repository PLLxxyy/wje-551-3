<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { suppliersApi } from '../api/suppliers';
import DataTable from '../components/common/DataTable.vue';
import StatusBadge from '../components/common/StatusBadge.vue';
import { useSupplierStore } from '../stores/supplierStore';
import { formatDate } from '../utils/format';

const route = useRoute();
const store = useSupplierStore();
onMounted(() => store.fetchDetail(String(route.params.id)));
async function rate() { await suppliersApi.rating(String(route.params.id), 4.8, '本月准时率优秀'); await store.fetchDetail(String(route.params.id)); }
</script>

<template>
  <section v-if="store.current">
    <div class="page-title"><h2>{{ store.current.name }}</h2><StatusBadge :value="store.current.status" /></div>
    <div class="grid two">
      <div class="panel">
        <h3>基本信息</h3>
        <p>联系人：{{ store.current.contact }} / {{ store.current.phone }}</p>
        <p>邮箱：{{ store.current.email }}</p>
        <p>地址：{{ store.current.address }}</p>
        <p>加权评分：{{ store.current.rating }}</p>
        <button class="btn secondary" @click="rate">新增评分 4.8</button>
      </div>
      <div class="panel">
        <h3>评分历史</h3>
        <p v-for="item in store.current.ratingHistory" :key="item.id">{{ item.score }} 分 · {{ item.remark }} · {{ formatDate(item.createdAt) }}</p>
      </div>
    </div>
    <h3>关联运单</h3>
    <DataTable :columns="[{key:'orderNo',title:'运单'},{key:'status',title:'状态'},{key:'createdAt',title:'创建时间'}]" :data="(store.current as any).shipments ?? []">
      <template #status="{ row }"><StatusBadge :value="row.status" /></template>
      <template #createdAt="{ row }">{{ formatDate(row.createdAt) }}</template>
    </DataTable>
  </section>
</template>
