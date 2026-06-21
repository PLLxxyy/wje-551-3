<script setup lang="ts">
import { onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import { suppliersApi } from '../api/suppliers';
import DataTable from '../components/common/DataTable.vue';
import StatusBadge from '../components/common/StatusBadge.vue';
import { SupplierStatus } from '../constants/enums';
import { PERMISSIONS } from '../constants/permissions';
import { useSupplierStore } from '../stores/supplierStore';
import { formatDate } from '../utils/format';

const store = useSupplierStore();
onMounted(() => store.fetchList());
async function review(id: string, approved: boolean) { await suppliersApi.review(id, approved); await store.fetchList(); }
</script>

<template>
  <section>
    <div class="page-title"><h2>供应商管理</h2><button v-permission="PERMISSIONS.SUPPLIER_WRITE" class="btn">新建供应商</button></div>
    <div class="toolbar">
      <input v-model="store.filters.name" placeholder="按名称搜索" @input="store.fetchList()" />
      <select v-model="store.filters.status" @change="store.fetchList()">
        <option value="">全部状态</option>
        <option v-for="status in Object.values(SupplierStatus)" :key="status" :value="status">{{ status }}</option>
      </select>
    </div>
    <DataTable :columns="[{key:'name',title:'名称'},{key:'contact',title:'联系人'},{key:'phone',title:'电话'},{key:'status',title:'状态'},{key:'rating',title:'评分'},{key:'createdAt',title:'创建时间'}]" :data="store.suppliers as any">
      <template #status="{ row }"><StatusBadge :value="row.status" /></template>
      <template #createdAt="{ row }">{{ formatDate(row.createdAt) }}</template>
      <template #actions="{ row }">
        <RouterLink class="link" :to="`/suppliers/${row.id}`">详情</RouterLink>
        <button v-if="row.status === SupplierStatus.PENDING_REVIEW" v-permission="PERMISSIONS.SUPPLIER_WRITE" class="mini" @click="review(row.id, true)">通过</button>
      </template>
    </DataTable>
  </section>
</template>

<style scoped>
.link { color:#175c4a; font-weight:800; margin-right:10px; }
.mini { border:0; background:#cddf89; border-radius:5px; padding:5px 8px; cursor:pointer; }
</style>
