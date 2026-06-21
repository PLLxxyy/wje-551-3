import { v4 as uuid } from 'uuid';
import { SupplierStatus } from '../constants/enums.js';
import { PERMISSIONS } from '../constants/permissions.js';
import { shipments, suppliers } from '../database/seeds/initial.js';
import type { Supplier, User } from '../types/index.js';
import { auditService } from './audit.service.js';
import { BusinessException } from '../utils/response.js';
import { assertRequired } from '../utils/validation.js';

export class SuppliersService {
  list(query: Record<string, string | undefined>) {
    return suppliers
      .filter((supplier) => !query.name || supplier.name.includes(query.name))
      .filter((supplier) => !query.status || supplier.status === query.status)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  detail(id: string) {
    const supplier = suppliers.find((item) => item.id === id);
    if (!supplier) throw new BusinessException(404, '供应商不存在');
    return { ...supplier, shipments: shipments.filter((item) => item.supplierId === id) };
  }

  create(payload: Partial<Supplier>, user?: User) {
    assertRequired(payload.name, '供应商名称');
    assertRequired(payload.contact, '联系人');
    assertRequired(payload.phone, '联系电话');
    if (suppliers.some((item) => item.name === payload.name)) throw new BusinessException(400, '供应商名称不可重复');
    const now = new Date().toISOString();
    const supplier: Supplier = {
      id: uuid(),
      name: payload.name!,
      contact: payload.contact!,
      phone: payload.phone!,
      email: payload.email ?? '',
      address: payload.address ?? '',
      status: SupplierStatus.PENDING_REVIEW,
      rating: 0,
      ratingHistory: [],
      createdAt: now,
      updatedAt: now,
    };
    suppliers.unshift(supplier);
    auditService.record({ action: 'CREATE', module: 'SUPPLIER', targetId: supplier.id, targetName: supplier.name, detail: supplier }, user);
    return supplier;
  }

  update(id: string, payload: Partial<Supplier>, user?: User) {
    const supplier = this.detail(id);
    Object.assign(supplier, payload, { id, updatedAt: new Date().toISOString() });
    auditService.record({ action: 'UPDATE', module: 'SUPPLIER', targetId: id, targetName: supplier.name, detail: payload }, user);
    return supplier;
  }

  review(id: string, approved: boolean, user?: User) {
    const supplier = this.detail(id);
    supplier.status = approved ? SupplierStatus.ACTIVE : SupplierStatus.INACTIVE;
    supplier.updatedAt = new Date().toISOString();
    auditService.record({ action: 'STATUS_CHANGE', module: 'SUPPLIER', targetId: id, targetName: supplier.name, detail: { approved } }, user);
    return supplier;
  }

  rate(id: string, score: number, weight = 1, remark = '', user?: User) {
    if (!user?.permissions.includes(PERMISSIONS.SUPPLIER_WRITE)) throw new BusinessException(403, '无权限执行评分');
    if (score < 1 || score > 5) throw new BusinessException(400, '评分必须在1-5之间');
    const supplier = this.detail(id);
    supplier.ratingHistory.unshift({ id: uuid(), score, weight, remark, createdAt: new Date().toISOString() });
    const totalWeight = supplier.ratingHistory.reduce((sum, item) => sum + item.weight, 0);
    supplier.rating = Number((supplier.ratingHistory.reduce((sum, item) => sum + item.score * item.weight, 0) / totalWeight).toFixed(1));
    supplier.updatedAt = new Date().toISOString();
    auditService.record({ action: 'UPDATE', module: 'SUPPLIER', targetId: id, targetName: supplier.name, detail: { score, weight, rating: supplier.rating } }, user);
    return supplier;
  }
}

export const suppliersService = new SuppliersService();
