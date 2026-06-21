import { request } from './request';
import type { Supplier } from '../types/supplier';

export const suppliersApi = {
  list: (params?: Record<string, string>) => request.get<Supplier[]>('/suppliers', { params }),
  detail: (id: string) => request.get<Supplier>(`/suppliers/${id}`),
  create: (payload: Partial<Supplier>) => request.post<Supplier>('/suppliers', payload),
  update: (id: string, payload: Partial<Supplier>) => request.put<Supplier>(`/suppliers/${id}`, payload),
  review: (id: string, approved: boolean) => request.post<Supplier>(`/suppliers/${id}/review`, { approved }),
  rating: (id: string, score: number, remark: string) => request.post<Supplier>(`/suppliers/${id}/rating`, { score, remark }),
};
