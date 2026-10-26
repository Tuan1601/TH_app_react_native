import { request } from './client';
import type { Course, Id } from '../types/models';

export const courseService = {
  getAll: () => request<Course[]>('GET', '/courses'),
  getById: (id: Id) => request<Course>('GET', `/courses/${id}`),
  update: (id: Id, data: Partial<Course>) => request<Course>('PATCH', `/courses/${id}`, data),
  create: (data: Omit<Course, 'id'>) => request<Course>('POST', '/courses', data),
};

export default courseService;
