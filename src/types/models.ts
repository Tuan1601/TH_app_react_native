// Kiểu dữ liệu dùng chung cho ứng dụng Quản lý học tập (Thực hành 4).

export type Id = number | string;

export interface Student {
  id: Id;
  studentCode: string;
  fullName: string;
  className: string;
  major: string;
  email: string;
  phone: string;
  updatedAt: string;
}

export interface Course {
  id: Id;
  code: string;
  name: string;
  credits: number;
  lecturer: string;
  description: string;
  semester: string;
}

export interface Session {
  id: Id;
  courseId: Id;
  /** 2 (Thứ 2) → 8 (Chủ nhật) */
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  room: string;
  note: string;
  course?: Course;
}

export type AssignmentStatus = 'todo' | 'done';

export interface Assignment {
  id: Id;
  courseId: Id;
  title: string;
  description: string;
  dueDate: string;
  status: AssignmentStatus;
  updatedAt: string;
  course?: Course;
}

export interface Grade {
  id: Id;
  courseId: Id;
  semester: string;
  attendance: number;
  midterm: number;
  final: number;
  total: number;
  letter: string;
  course?: Course;
}

export interface NewAssignmentInput {
  courseId: Id;
  title: string;
  description: string;
  dueDate: string;
}

export type StudentChanges = Partial<Pick<Student, 'fullName' | 'email' | 'phone'>>;

export interface Resources {
  student: Student | null;
  courses: Course[] | null;
  sessions: Session[] | null;
  assignments: Assignment[] | null;
  grades: Grade[] | null;
}

export type ResourceName = keyof Resources;

export type ApiErrorType = 'network' | 'timeout' | 'http';

export interface ApiError {
  type: ApiErrorType;
  status: number | null;
  message: string;
}

export type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

export interface OutboxMeta {
  entity: ResourceName;
  /** id bản ghi trên server (PATCH) */
  entityId?: Id;
  /** id tạm của bản ghi tạo khi offline (POST) */
  localId?: string;
  /** updatedAt của bản ghi trên máy tại thời điểm sửa offline (dùng phát hiện xung đột) */
  baseUpdatedAt?: string;
  /** Mô tả ngắn để hiển thị khi báo đồng bộ / xung đột */
  label?: string;
}

export interface OutboxAction {
  id: string;
  method: HttpMethod;
  url: string;
  body?: Record<string, unknown>;
  createdAt: string;
  meta?: OutboxMeta;
}

export type NewOutboxAction = Omit<OutboxAction, 'id' | 'createdAt'>;

export interface CacheEntry<T> {
  data: T;
  savedAt: string;
}
