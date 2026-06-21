import { defineStore } from 'pinia';
import { authApi } from '../api/auth';
import { storage } from '../utils/storage';

interface SafeUser {
  id: string;
  username: string;
  name: string;
  roles: string[];
  permissions: string[];
}

export const useAuthStore = defineStore('auth', {
  state: () => ({ token: storage.getToken() ?? '', user: null as SafeUser | null }),
  getters: {
    isLoggedIn: (state) => Boolean(state.token),
    permissions: (state) => state.user?.permissions ?? [],
  },
  actions: {
    async login(username: string, password: string) {
      const result = await authApi.login({ username, password }) as unknown as { token: string; user: SafeUser };
      this.token = result.token;
      this.user = result.user;
      storage.setToken(result.token);
    },
    async fetchMe() {
      if (!this.token) return;
      this.user = await authApi.me() as unknown as SafeUser;
    },
    logout() {
      this.token = '';
      this.user = null;
      storage.clearToken();
    },
  },
});
