import { request } from './client';
import { CURRENT_STUDENT_ID } from '../config';
import type { Id, Student } from '../types/models';

export const studentService = {
  /** Sinh viên hiện tại: GET /students/1 */
  getAll: () => request<Student>('GET', `/students/${CURRENT_STUDENT_ID}`),
  getById: (id: Id) => request<Student>('GET', `/students/${id}`),
  update: (id: Id, data: Partial<Student>) => request<Student>('PATCH', `/students/${id}`, data),
  create: (data: Omit<Student, 'id'>) => request<Student>('POST', '/students', data),
};

export default studentService;
