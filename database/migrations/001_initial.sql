CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  username VARCHAR(64) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(64) NOT NULL,
  email VARCHAR(128),
  phone VARCHAR(32),
  status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL
);

CREATE TABLE roles (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(64) NOT NULL,
  code VARCHAR(64) NOT NULL UNIQUE,
  description VARCHAR(255)
);

CREATE TABLE user_roles (
  user_id VARCHAR(36) NOT NULL,
  role_id VARCHAR(36) NOT NULL,
  PRIMARY KEY (user_id, role_id),
  INDEX idx_user_roles_user_id (user_id),
  INDEX idx_user_roles_role_id (role_id)
);

CREATE TABLE permissions (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(64) NOT NULL,
  code VARCHAR(128) NOT NULL UNIQUE,
  module VARCHAR(64) NOT NULL
);

CREATE TABLE role_permissions (
  role_id VARCHAR(36) NOT NULL,
  permission_id VARCHAR(36) NOT NULL,
  PRIMARY KEY (role_id, permission_id),
  INDEX idx_role_permissions_role_id (role_id),
  INDEX idx_role_permissions_permission_id (permission_id)
);

CREATE TABLE suppliers (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(128) NOT NULL,
  contact VARCHAR(64) NOT NULL,
  phone VARCHAR(32) NOT NULL,
  email VARCHAR(128),
  address VARCHAR(255),
  status ENUM('ACTIVE','INACTIVE','BLACKLISTED','PENDING_REVIEW') NOT NULL DEFAULT 'PENDING_REVIEW',
  rating DECIMAL(2,1) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  UNIQUE KEY uk_suppliers_name (name)
);

CREATE TABLE warehouses (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(128) NOT NULL,
  address VARCHAR(255),
  capacity INT NOT NULL,
  status ENUM('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL
);

CREATE TABLE inventories (
  id VARCHAR(36) PRIMARY KEY,
  warehouse_id VARCHAR(36) NOT NULL,
  sku_id VARCHAR(64) NOT NULL,
  sku_name VARCHAR(128) NOT NULL,
  quantity INT NOT NULL DEFAULT 0,
  safety_stock INT NOT NULL DEFAULT 0,
  alert_level ENUM('NORMAL','LOW','CRITICAL') NOT NULL DEFAULT 'NORMAL',
  updated_at DATETIME NOT NULL,
  UNIQUE KEY uk_inventories_warehouse_sku (warehouse_id, sku_id),
  INDEX idx_inventories_warehouse_id (warehouse_id)
);

CREATE TABLE shipments (
  id VARCHAR(36) PRIMARY KEY,
  order_no VARCHAR(32) NOT NULL,
  supplier_id VARCHAR(36) NOT NULL,
  warehouse_id VARCHAR(36) NOT NULL,
  status ENUM('PENDING','SHIPPED','IN_TRANSIT','DELIVERED','EXCEPTION','CANCELLED') NOT NULL DEFAULT 'PENDING',
  tracking_no VARCHAR(128),
  carrier VARCHAR(128),
  estimated_arrival DATETIME,
  actual_arrival DATETIME,
  remark TEXT,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  UNIQUE KEY uk_shipments_order_no (order_no),
  INDEX idx_shipments_supplier_id (supplier_id),
  INDEX idx_shipments_warehouse_id (warehouse_id),
  INDEX idx_shipments_status (status)
);

CREATE TABLE shipment_items (
  id VARCHAR(36) PRIMARY KEY,
  shipment_id VARCHAR(36) NOT NULL,
  sku_id VARCHAR(64) NOT NULL,
  sku_name VARCHAR(128) NOT NULL,
  quantity INT NOT NULL,
  INDEX idx_shipment_items_shipment_id (shipment_id)
);

CREATE TABLE audit_logs (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  username VARCHAR(64) NOT NULL,
  action VARCHAR(32) NOT NULL,
  module VARCHAR(32) NOT NULL,
  target_id VARCHAR(36) NOT NULL,
  target_name VARCHAR(128) NOT NULL,
  detail JSON,
  ip VARCHAR(64),
  created_at DATETIME NOT NULL,
  INDEX idx_audit_logs_module_created_at (module, created_at),
  INDEX idx_audit_logs_user_id (user_id)
);
