import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from './App.vue';
import { registerPermissionDirective } from './directives/v-permission';
import { router } from './router';

const app = createApp(App);
app.use(createPinia());
app.use(router);
registerPermissionDirective(app);
app.mount('#app');
