<script setup lang="ts">
import EmptyState from './EmptyState.vue';

defineProps<{
  columns: Array<{ key: string; title: string; sortable?: boolean }>;
  data: Array<Record<string, unknown>>;
  loading?: boolean;
}>();

defineSlots<{
  [key: string]: ((props: { row: any }) => any) | undefined;
  actions?: (props: { row: any }) => any;
}>();
</script>

<template>
  <div class="table-wrap">
    <div v-if="loading" class="loading">加载中...</div>
    <EmptyState v-else-if="!data.length">当前筛选条件下没有记录</EmptyState>
    <table v-else>
      <thead>
        <tr><th v-for="column in columns" :key="column.key">{{ column.title }}</th><th v-if="$slots.actions">操作</th></tr>
      </thead>
      <tbody>
        <tr v-for="(row, index) in data" :key="String(row.id ?? index)">
          <td v-for="column in columns" :key="column.key"><slot :name="column.key" :row="row">{{ row[column.key] }}</slot></td>
          <td v-if="$slots.actions"><slot name="actions" :row="row" /></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.table-wrap { width:100%; overflow:auto; border:1px solid #dbe1e6; border-radius:8px; background:#fbfcf7; }
table { width:100%; border-collapse:collapse; min-width:720px; }
th { background:#26352f; color:#f7f4e8; text-align:left; font-size:13px; padding:12px; white-space:nowrap; }
td { border-top:1px solid #e4e8ec; padding:12px; font-size:14px; color:#1e2a25; vertical-align:middle; }
tr:hover td { background:#f2f5ed; }
.loading { padding:28px; color:#58635e; }
</style>
