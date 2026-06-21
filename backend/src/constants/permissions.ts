export const PERMISSIONS = {
  SUPPLIER_READ: 'supplier:read',
  SUPPLIER_WRITE: 'supplier:write',
  INVENTORY_READ: 'inventory:read',
  INVENTORY_WRITE: 'inventory:write',
  SHIPMENT_READ: 'shipment:read',
  SHIPMENT_WRITE: 'shipment:write',
  SHIPMENT_RECEIVE: 'shipment:receive',
  DASHBOARD_READ: 'dashboard:read',
  AUDIT_READ: 'audit:read',
  USER_MANAGE: 'user:manage',
} as const;

export type PermissionCode = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
