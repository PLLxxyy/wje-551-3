import axios from 'axios';
import { storage } from '../utils/storage';

const http = axios.create({ baseURL: '/api/v1', timeout: 8000 });

http.interceptors.request.use((config) => {
  const token = storage.getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

http.interceptors.response.use(
  (response) => response.data.data,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message;
    if (status === 401) {
      storage.clearToken();
      location.href = '/login';
    } else if (status === 403) {
      window.dispatchEvent(new CustomEvent('app-error', { detail: '无权限执行此操作' }));
    } else if ([400, 404, 422].includes(status)) {
      window.dispatchEvent(new CustomEvent('app-error', { detail: message }));
    } else if (status === 500) {
      window.dispatchEvent(new CustomEvent('app-error', { detail: '服务器异常，请稍后重试' }));
    } else {
      window.dispatchEvent(new CustomEvent('app-error', { detail: '网络连接失败，请检查网络' }));
    }
    return Promise.reject(error);
  },
);

export const request = http as unknown as {
  get<T = unknown>(url: string, config?: unknown): Promise<T>;
  post<T = unknown>(url: string, data?: unknown, config?: unknown): Promise<T>;
  put<T = unknown>(url: string, data?: unknown, config?: unknown): Promise<T>;
  delete<T = unknown>(url: string, config?: unknown): Promise<T>;
};
