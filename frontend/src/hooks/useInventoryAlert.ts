import { InventoryAlertLevel } from '../constants/enums';

export function useInventoryAlert() {
  const tone = (level: InventoryAlertLevel) => level === InventoryAlertLevel.CRITICAL ? 'danger' : level === InventoryAlertLevel.LOW ? 'warn' : 'ok';
  return { tone };
}
