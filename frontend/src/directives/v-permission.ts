import type { App, DirectiveBinding } from 'vue';
import { useAuthStore } from '../stores/authStore';

export function registerPermissionDirective(app: App) {
  app.directive('permission', {
    mounted(el: HTMLElement, binding: DirectiveBinding<string>) {
      const auth = useAuthStore();
      if (!auth.permissions.includes(binding.value)) el.remove();
    },
  });
}
