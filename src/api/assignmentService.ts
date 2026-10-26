import { request } from './client';
import type { Assignment, Id } from '../types/models';

export const assignmentService = {
  getAll: () => request<Assignment[]>('GET', '/assignments?_expand=course&_sort=dueDate'),
  getById: (id: Id) => request<Assignment>('GET', `/assignments/${id}?_expand=course`),
  update: (id: Id, data: Partial<Assignment>) =>
    request<Assignment>('PATCH', `/assignments/${id}`, data),
  create: (data: Omit<Assignment, 'id' | 'course'>) =>
    request<Assignment>('POST', '/assignments', data),
};

export default assignmentService;
