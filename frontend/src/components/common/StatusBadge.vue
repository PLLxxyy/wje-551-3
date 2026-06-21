<script setup lang="ts">
import { computed } from 'vue';
import { InventoryAlertLevelLabel, ShipmentStatusLabel, SupplierStatusLabel } from '../../constants/enums';

const props = defineProps<{ value: string }>();

const labels: Record<string, string> = { ...ShipmentStatusLabel, ...SupplierStatusLabel, ...InventoryAlertLevelLabel };
const tone = computed(() => ({
  ACTIVE: 'ok',
  DELIVERED: 'ok',
  NORMAL: 'ok',
  LOW: 'warn',
  SHIPPED: 'blue',
  IN_TRANSIT: 'warn',
  CRITICAL: 'danger',
  EXCEPTION: 'danger',
  BLACKLISTED: 'danger',
  PENDING: 'muted',
  PENDING_REVIEW: 'muted',
  CANCELLED: 'muted',
  INACTIVE: 'muted',
}[props.value] ?? 'muted'));
</script>

<template>
  <span class="badge" :class="tone">{{ labels[value] ?? value }}</span>
</template>

<style scoped>
.badge { display:inline-flex; align-items:center; min-width:64px; justify-content:center; border-radius:6px; padding:4px 8px; font-size:12px; font-weight:700; }
.ok { background:#dff4e7; color:#17613a; }
.warn { background:#fff0c2; color:#7a4b00; }
.danger { background:#ffe0df; color:#9f1d18; }
.blue { background:#ddeaff; color:#174d91; }
.muted { background:#e9edf0; color:#4b5965; }
</style>
