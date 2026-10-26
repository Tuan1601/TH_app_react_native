import { request } from './client';
import type { Id, Session } from '../types/models';

export const sessionService = {
  getAll: () => request<Session[]>('GET', '/sessions?_expand=course'),
  getById: (id: Id) => request<Session>('GET', `/sessions/${id}?_expand=course`),
  update: (id: Id, data: Partial<Session>) => request<Session>('PATCH', `/sessions/${id}`, data),
  create: (data: Omit<Session, 'id'>) => request<Session>('POST', '/sessions', data),
};

export default sessionService;
