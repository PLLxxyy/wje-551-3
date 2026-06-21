<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router';
import { useAuthStore } from './stores/authStore';

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();
const collapsed = ref(false);
const error = ref('');
const isLogin = computed(() => route.path === '/login');
const nav = [
  ['/dashboard', '总览'],
  ['/suppliers', '供应商'],
  ['/inventory', '库存'],
  ['/shipments', '运单'],
  ['/audit-logs', '审计'],
];

onMounted(() => {
  window.addEventListener('app-error', ((event: CustomEvent<string>) => {
    error.value = event.detail;
    setTimeout(() => { error.value = ''; }, 2600);
  }) as EventListener);
});

function logout() {
  auth.logout();
  router.push('/login');
}
</script>

<template>
  <RouterView v-if="isLogin" />
  <div v-else class="shell">
    <aside :class="{ collapsed }">
      <div class="brand">
        <strong>SupplyChain Hub</strong>
        <button @click="collapsed = !collapsed">☰</button>
      </div>
      <nav>
        <RouterLink v-for="[path, label] in nav" :key="path" :to="path">{{ label }}</RouterLink>
      </nav>
    </aside>
    <main>
      <header>
        <div>
          <small>供应链协同控制台</small>
          <h1>{{ auth.user?.name ?? '运营用户' }}</h1>
        </div>
        <button class="ghost" @click="logout">退出</button>
      </header>
      <p v-if="error" class="toast">{{ error }}</p>
      <RouterView />
    </main>
  </div>
</template>

<style>
* { box-sizing:border-box; }
body { margin:0; font-family:"Avenir Next", "Segoe UI", sans-serif; background:#eef1e8; color:#1e2a25; }
button, input, select { font:inherit; }
.shell { min-width:1280px; display:grid; grid-template-columns:auto 1fr; min-height:100vh; }
aside { width:236px; background:#17241f; color:#f6f1df; padding:20px 14px; transition:width .2s ease; }
aside.collapsed { width:84px; }
.brand { display:flex; justify-content:space-between; align-items:center; gap:8px; margin-bottom:28px; }
.brand button, .ghost { border:1px solid #6f7d73; background:transparent; color:inherit; border-radius:6px; height:34px; padding:0 10px; cursor:pointer; }
nav { display:grid; gap:8px; }
nav a { color:#d7ddce; text-decoration:none; padding:11px 12px; border-radius:6px; font-weight:700; }
nav a.router-link-active { background:#cddf89; color:#18221d; }
main { padding:22px 28px 36px; }
header { display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; }
header h1 { margin:4px 0 0; font-size:28px; }
header small { color:#657068; }
.toast { position:fixed; right:24px; top:18px; z-index:9; background:#9f1d18; color:white; padding:12px 16px; border-radius:6px; }
.page-title { display:flex; align-items:end; justify-content:space-between; margin-bottom:16px; }
.page-title h2 { margin:0; font-size:24px; }
.toolbar { display:flex; gap:10px; align-items:center; margin-bottom:14px; }
.panel { background:#fbfcf7; border:1px solid #dbe1e6; border-radius:8px; padding:16px; }
.grid { display:grid; gap:16px; }
.two { grid-template-columns:1fr 1fr; }
.btn { height:38px; border:0; border-radius:6px; background:#26352f; color:#fffbea; padding:0 14px; cursor:pointer; font-weight:700; }
.btn.secondary { background:#e1e8d0; color:#26352f; }
input, select { height:38px; border:1px solid #b8c0c8; border-radius:6px; padding:0 10px; background:#fffdfa; }
</style>
