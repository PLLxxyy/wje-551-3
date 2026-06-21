import { createRouter, createWebHistory } from 'vue-router';
import { PERMISSIONS } from '../constants/permissions';
import { useAuthStore } from '../stores/authStore';
import AuditLog from '../pages/AuditLog.vue';
import Dashboard from '../pages/Dashboard.vue';
import Forbidden from '../pages/Forbidden.vue';
import Inventory from '../pages/Inventory.vue';
import Login from '../pages/Login.vue';
import ShipmentDetail from '../pages/ShipmentDetail.vue';
import Shipments from '../pages/Shipments.vue';
import SupplierDetail from '../pages/SupplierDetail.vue';
import Suppliers from '../pages/Suppliers.vue';

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', component: Login, meta: { public: true } },
    { path: '/', redirect: '/dashboard' },
    { path: '/dashboard', component: Dashboard, meta: { permission: PERMISSIONS.DASHBOARD_READ } },
    { path: '/suppliers', component: Suppliers, meta: { permission: PERMISSIONS.SUPPLIER_READ } },
    { path: '/suppliers/:id', component: SupplierDetail, meta: { permission: PERMISSIONS.SUPPLIER_READ } },
    { path: '/inventory', component: Inventory, meta: { permission: PERMISSIONS.INVENTORY_READ } },
    { path: '/shipments', component: Shipments, meta: { permission: PERMISSIONS.SHIPMENT_READ } },
    { path: '/shipments/:id', component: ShipmentDetail, meta: { permission: PERMISSIONS.SHIPMENT_READ } },
    { path: '/audit-logs', component: AuditLog, meta: { permission: PERMISSIONS.AUDIT_READ } },
    { path: '/403', component: Forbidden },
  ],
});

router.beforeEach(async (to) => {
  const auth = useAuthStore();
  if (to.meta.public) return true;
  if (!auth.isLoggedIn) return '/login';
  if (!auth.user) await auth.fetchMe();
  const permission = to.meta.permission as string | undefined;
  if (permission && !auth.permissions.includes(permission)) return '/403';
  return true;
});
