import type { Assignment, Course, Id, OutboxAction, Student } from '../types/models';

export const LOCAL_ID_PREFIX = 'local-';

export const sameId = (a?: Id | null, b?: Id | null) =>
  a !== undefined && a !== null && b !== undefined && b !== null && String(a) === String(b);

export const isLocalId = (id: Id) => String(id).startsWith(LOCAL_ID_PREFIX);

const byDueDate = (a: Assignment, b: Assignment) =>
  new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();

/**
 * Áp các thao tác chưa đồng bộ (outbox) lên dữ liệu server
 * để giao diện luôn phản ánh thay đổi của người dùng.
 */
export function overlayAssignments(
  list: Assignment[] | null,
  actions: OutboxAction[],
  courses: Course[] | null,
): Assignment[] | null {
  const related = actions.filter(action => action.meta?.entity === 'assignments');
  if (!related.length) {
    return list;
  }
  let result = [...(list ?? [])];
  related.forEach(action => {
    const meta = action.meta!;
    if (action.method === 'PATCH' && meta.entityId !== undefined) {
      result = result.map(item =>
        sameId(item.id, meta.entityId) ? { ...item, ...(action.body as Partial<Assignment>) } : item,
      );
    } else if (action.method === 'POST' && meta.localId) {
      if (!result.some(item => sameId(item.id, meta.localId))) {
        const body = action.body as unknown as Omit<Assignment, 'id'>;
        result.push({
          ...body,
          id: meta.localId,
          course: (courses ?? []).find(course => sameId(course.id, body.courseId)),
        });
      }
    }
  });
  return result.sort(byDueDate);
}

export function overlayStudent(student: Student | null, actions: OutboxAction[]): Student | null {
  if (!student) {
    return student;
  }
  return actions
    .filter(action => action.meta?.entity === 'student' && action.method === 'PATCH')
    .reduce<Student>((acc, action) => ({ ...acc, ...(action.body as Partial<Student>) }), student);
}

/** Bổ sung course cho các bản ghi chưa được _expand (ví dụ bản ghi trả về từ PATCH/POST). */
export function attachCourse<T extends { courseId: Id; course?: Course }>(
  item: T,
  courses: Course[] | null,
): T {
  if (item.course) {
    return item;
  }
  const course = (courses ?? []).find(entry => sameId(entry.id, item.courseId));
  return course ? { ...item, course } : item;
}
