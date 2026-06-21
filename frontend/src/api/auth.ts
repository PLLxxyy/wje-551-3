import { request } from './request';

export const authApi = {
  login: (payload: { username: string; password: string }) => request.post('/auth/login', payload),
  me: () => request.get('/auth/me'),
};
