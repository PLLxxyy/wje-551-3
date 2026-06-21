import { computed, ref } from 'vue';

export function usePagination<T>(items: () => T[], pageSize = 8) {
  const page = ref(1);
  const total = computed(() => items().length);
  const paged = computed(() => items().slice((page.value - 1) * pageSize, page.value * pageSize));
  return { page, pageSize, total, paged };
}
