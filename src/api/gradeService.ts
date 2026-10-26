import { request } from './client';
import type { Grade, Id } from '../types/models';

export const gradeService = {
  getAll: () => request<Grade[]>('GET', '/grades?_expand=course'),
  getById: (id: Id) => request<Grade>('GET', `/grades/${id}?_expand=course`),
  update: (id: Id, data: Partial<Grade>) => request<Grade>('PATCH', `/grades/${id}`, data),
  create: (data: Omit<Grade, 'id'>) => request<Grade>('POST', '/grades', data),
};

export default gradeService;
