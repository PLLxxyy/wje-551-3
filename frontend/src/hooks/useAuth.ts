import { computed } from 'vue';
import { useAuthStore } from '../stores/authStore';

export function useAuth() {
  const auth = useAuthStore();
  const can = (permission: string) => computed(() => auth.permissions.includes(permission));
  return { auth, can };
}
