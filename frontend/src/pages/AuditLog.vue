<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { request } from '../api/request';
import DataTable from '../components/common/DataTable.vue';
import { formatDate } from '../utils/format';

const logs = ref<any[]>([]);
const module = ref('');
async function load() { logs.value = await request.get('/audit-logs', { params: { module: module.value } }) as any[]; }
onMounted(load);
</script>

<template>
  <section>
    <div class="page-title"><h2>审计日志</h2></div>
    <div class="toolbar">
      <select v-model="module" @change="load">
        <option value="">全部模块</option>
        <option>SUPPLIER</option><option>INVENTORY</option><option>SHIPMENT</option><option>USER</option>
      </select>
    </div>
    <DataTable :columns="[{key:'module',title:'模块'},{key:'action',title:'动作'},{key:'username',title:'操作人'},{key:'targetName',title:'目标'},{key:'createdAt',title:'时间'}]" :data="logs">
      <template #createdAt="{ row }">{{ formatDate(row.createdAt) }}</template>
    </DataTable>
  </section>
</template>
