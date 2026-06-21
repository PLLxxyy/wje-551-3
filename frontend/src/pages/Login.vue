<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';

const auth = useAuthStore();
const router = useRouter();
const username = ref('admin');
const password = ref('admin123');

async function submit() {
  await auth.login(username.value, password.value);
  router.push('/dashboard');
}
</script>

<template>
  <main class="login">
    <section>
      <p>SupplyChain Hub</p>
      <h1>供应链协同控制台</h1>
      <form @submit.prevent="submit">
        <input v-model="username" placeholder="账号" />
        <input v-model="password" type="password" placeholder="密码" />
        <button class="btn">登录</button>
      </form>
      <small>验证账号：admin / admin123；purchase / purchase123；warehouse / warehouse123</small>
    </section>
  </main>
</template>

<style scoped>
.login { min-height:100vh; display:grid; place-items:center; background:linear-gradient(135deg,#dfe7d4,#f8f0d8); }
section { width:420px; background:#17241f; color:#fff8df; padding:38px; border-radius:8px; box-shadow:0 24px 60px #1d2b2130; }
p { margin:0 0 8px; color:#cddf89; font-weight:800; }
h1 { margin:0 0 24px; font-size:32px; }
form { display:grid; gap:12px; margin-bottom:16px; }
.btn { background:#cddf89; color:#17241f; }
small { color:#d7ddce; line-height:1.7; }
</style>
