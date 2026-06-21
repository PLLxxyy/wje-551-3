import { InventoryAlertLevel, ShipmentStatus, SupplierStatus } from '../constants/enums.js';
import { inventories, shipments, suppliers, warehouses } from '../database/seeds/initial.js';

export class DashboardService {
  stats() {
    const shipmentStatus = Object.values(ShipmentStatus).map((status) => ({ status, count: shipments.filter((item) => item.status === status).length }));
    const ratingBuckets = [
      { label: '1-2', count: suppliers.filter((item) => item.rating >= 1 && item.rating < 2).length },
      { label: '2-3', count: suppliers.filter((item) => item.rating >= 2 && item.rating < 3).length },
      { label: '3-4', count: suppliers.filter((item) => item.rating >= 3 && item.rating < 4).length },
      { label: '4-5', count: suppliers.filter((item) => item.rating >= 4 && item.rating <= 5).length },
    ];
    return {
      cards: {
        inTransitShipments: shipments.filter((item) => [ShipmentStatus.SHIPPED, ShipmentStatus.IN_TRANSIT].includes(item.status)).length,
        pendingReceiveShipments: shipments.filter((item) => item.status === ShipmentStatus.IN_TRANSIT).length,
        lowInventoryAlerts: inventories.filter((item) => [InventoryAlertLevel.LOW, InventoryAlertLevel.CRITICAL].includes(item.alertLevel)).length,
        activeSuppliers: suppliers.filter((item) => item.status === SupplierStatus.ACTIVE).length,
      },
      shipmentStatus,
      ratingBuckets,
      recentShipments: shipments.slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 10),
      inventoryAlerts: inventories
        .filter((item) => [InventoryAlertLevel.LOW, InventoryAlertLevel.CRITICAL].includes(item.alertLevel))
        .map((item) => ({ ...item, warehouseName: warehouses.find((warehouse) => warehouse.id === item.warehouseId)?.name ?? '-' })),
    };
  }
}

export const dashboardService = new DashboardService();
