<script setup lang="ts">
import { onMounted } from 'vue';
import { useInventoryStore } from '../../stores/inventoryStore';

const model = defineModel<string>({ required: true });
const store = useInventoryStore();
onMounted(() => store.fetchWarehouses());
</script>

<template>
  <select v-model="model" class="selector">
    <option v-for="warehouse in store.warehouses" :key="warehouse.id" :value="warehouse.id">{{ warehouse.name }}</option>
  </select>
</template>

<style scoped>
.selector { min-width:180px; height:38px; border:1px solid #b8c0c8; border-radius:6px; padding:0 10px; background:#fffdfa; }
</style>
