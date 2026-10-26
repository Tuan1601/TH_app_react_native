import type { Id, ResourceName } from '../types/models';

/** Khóa cache cho từng tập dữ liệu danh sách. */
export const CACHE_KEYS: Record<ResourceName, string> = {
  student: 'cache:student',
  courses: 'cache:courses',
  sessions: 'cache:sessions',
  assignments: 'cache:assignments',
  grades: 'cache:grades',
};

/** Khóa cache cho màn hình chi tiết, ví dụ cache:course:1 */
export const detailKey = (resource: 'course' | 'session' | 'assignment' | 'grade', id: Id) =>
  `cache:${resource}:${id}`;

/** Hàng đợi thao tác offline. */
export const OUTBOX_KEY = 'outbox:actions';
