import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react';
import { assignmentService } from '../api/assignmentService';
import { courseService } from '../api/courseService';
import { gradeService } from '../api/gradeService';
import { sessionService } from '../api/sessionService';
import { studentService } from '../api/studentService';
import { CURRENT_STUDENT_ID } from '../config';
import useCachedQuery, { type CachedQueryResult } from '../hooks/useCachedQuery';
import useNetworkStatus from '../hooks/useNetworkStatus';
import { CACHE_KEYS } from '../storage/keys';
import * as outbox from '../storage/outbox';
import {
  attachCourse,
  isLocalId,
  LOCAL_ID_PREFIX,
  overlayAssignments,
  overlayStudent,
  sameId,
} from '../utils/overlay';
import type {
  ApiError,
  Assignment,
  AssignmentStatus,
  Course,
  Grade,
  Id,
  NewAssignmentInput,
  OutboxAction,
  OutboxMeta,
  ResourceName,
  Session,
  Student,
  StudentChanges,
} from '../types/models';

export interface ResourceStatus {
  loading: boolean;
  refreshing: boolean;
  error: ApiError | null;
  lastUpdated: string | null;
}

export interface MutationResult {
  /** true nếu thao tác được đưa vào hàng đợi offline */
  queued: boolean;
}

export interface AppDataValue {
  student: Student | null;
  courses: Course[] | null;
  sessions: Session[] | null;
  assignments: Assignment[] | null;
  grades: Grade[] | null;
  status: Record<ResourceName, ResourceStatus>;
  isOnline: boolean;
  pendingActions: OutboxAction[];
  refresh: (name: ResourceName, pull?: boolean) => Promise<boolean>;
  refreshAll: (pull?: boolean) => Promise<void>;
  reloadPending: () => Promise<OutboxAction[]>;
  isPending: (entity: ResourceName, id?: Id) => boolean;
  toggleAssignmentStatus: (id: Id) => Promise<MutationResult>;
  createAssignment: (input: NewAssignmentInput) => Promise<MutationResult>;
  updateStudent: (changes: StudentChanges) => Promise<MutationResult>;
  /** Ghi bản ghi server trả về sau khi đồng bộ vào dữ liệu cục bộ. */
  applyServerRecord: (action: OutboxAction, record: unknown) => void;
}

const AppDataContext = createContext<AppDataValue | null>(null);

function toStatus<T>(query: CachedQueryResult<T>): ResourceStatus {
  return {
    loading: query.loading,
    refreshing: query.refreshing,
    error: query.error,
    lastUpdated: query.lastUpdated,
  };
}

export function AppDataProvider({ children }: PropsWithChildren) {
  const { isOnline } = useNetworkStatus();
  const onlineRef = useRef(isOnline);
  onlineRef.current = isOnline;

  const studentQuery = useCachedQuery<Student>(CACHE_KEYS.student, studentService.getAll);
  const coursesQuery = useCachedQuery<Course[]>(CACHE_KEYS.courses, courseService.getAll);
  const sessionsQuery = useCachedQuery<Session[]>(CACHE_KEYS.sessions, sessionService.getAll);
  const assignmentsQuery = useCachedQuery<Assignment[]>(
    CACHE_KEYS.assignments,
    assignmentService.getAll,
  );
  const gradesQuery = useCachedQuery<Grade[]>(CACHE_KEYS.grades, gradeService.getAll);

  /** Thao tác đã lưu trong outbox (chưa đồng bộ). */
  const [pendingActions, setPendingActions] = useState<OutboxAction[]>([]);
  /** Thao tác online đang chờ server phản hồi (cập nhật lạc quan, không lưu). */
  const [inflight, setInflight] = useState<OutboxAction[]>([]);

  const pendingRef = useRef(pendingActions);
  pendingRef.current = pendingActions;

  const reloadPending = useCallback(async () => {
    const actions = await outbox.getAll();
    setPendingActions(actions);
    return actions;
  }, []);

  useEffect(() => {
    reloadPending();
  }, [reloadPending]);

  const queries = useMemo(
    () => ({
      student: studentQuery,
      courses: coursesQuery,
      sessions: sessionsQuery,
      assignments: assignmentsQuery,
      grades: gradesQuery,
    }),
    [studentQuery, coursesQuery, sessionsQuery, assignmentsQuery, gradesQuery],
  );
  const queriesRef = useRef(queries);
  queriesRef.current = queries;

  // ----- Dữ liệu hiển thị = dữ liệu server + thao tác chưa đồng bộ -----
  const overlayActions = useMemo(() => [...pendingActions, ...inflight], [pendingActions, inflight]);
  const courses = coursesQuery.data;
  const assignments = useMemo(
    () =>
      overlayAssignments(assignmentsQuery.data, overlayActions, courses)?.map(item =>
        attachCourse(item, courses),
      ) ?? null,
    [assignmentsQuery.data, overlayActions, courses],
  );
  const student = useMemo(
    () => overlayStudent(studentQuery.data, overlayActions),
    [studentQuery.data, overlayActions],
  );

  // ----- Làm mới -----
  const refresh = useCallback(
    (name: ResourceName, pull = false) => queriesRef.current[name].refresh(pull),
    [],
  );
  const refreshAll = useCallback(async (pull = false) => {
    const all = queriesRef.current;
    await Promise.all(
      (Object.keys(all) as ResourceName[]).map(name => all[name].refresh(pull)),
    );
  }, []);

  const isPending = useCallback(
    (entity: ResourceName, id?: Id) =>
      pendingActions.some(
        action =>
          action.meta?.entity === entity &&
          (id === undefined || sameId(action.meta.entityId, id) || sameId(action.meta.localId, id)),
      ),
    [pendingActions],
  );

  /** Chạy một thao tác online với cập nhật lạc quan; lỗi thì tự hoàn tác. */
  const runOptimistic = useCallback(
    async <T,>(preview: OutboxAction, call: () => Promise<T>, onSuccess: (result: T) => void) => {
      setInflight(list => [...list, preview]);
      try {
        const result = await call();
        onSuccess(result);
      } finally {
        setInflight(list => list.filter(item => item.id !== preview.id));
      }
    },
    [],
  );

  // ----- Bài tập: đổi trạng thái -----
  const toggleAssignmentStatus = useCallback(
    async (id: Id): Promise<MutationResult> => {
      const current = (assignments ?? []).find(item => sameId(item.id, id));
      if (!current) {
        return { queued: false };
      }
      const status: AssignmentStatus = current.status === 'done' ? 'todo' : 'done';
      const updatedAt = new Date().toISOString();
      const body: Partial<Assignment> = { status, updatedAt };

      // Bài tập tạo offline: sửa luôn thao tác POST trong hàng đợi.
      if (isLocalId(id)) {
        const post = pendingRef.current.find(action => sameId(action.meta?.localId, id));
        if (post) {
          await outbox.update(post.id, { body: { ...post.body, ...body } });
          await reloadPending();
        }
        return { queued: true };
      }

      if (!onlineRef.current) {
        const existing = pendingRef.current.find(
          action =>
            action.method === 'PATCH' &&
            action.meta?.entity === 'assignments' &&
            sameId(action.meta.entityId, id),
        );
        if (existing) {
          await outbox.update(existing.id, { body: { ...existing.body, ...body } });
        } else {
          const server = (assignmentsQuery.data ?? []).find(item => sameId(item.id, id));
          await outbox.enqueue({
            method: 'PATCH',
            url: `/assignments/${id}`,
            body,
            meta: {
              entity: 'assignments',
              entityId: id,
              baseUpdatedAt: server?.updatedAt,
              label: `Bài tập "${current.title}"`,
            },
          });
        }
        await reloadPending();
        return { queued: true };
      }

      await runOptimistic(
        {
          id: `inflight-${Date.now()}`,
          method: 'PATCH',
          url: `/assignments/${id}`,
          body,
          createdAt: updatedAt,
          meta: { entity: 'assignments', entityId: id },
        },
        () => assignmentService.update(id, body),
        updated =>
          assignmentsQuery.mutate(list =>
            (list ?? []).map(item =>
              sameId(item.id, id) ? { ...item, ...updated, course: item.course } : item,
            ),
          ),
      );
      return { queued: false };
    },
    [assignments, assignmentsQuery, reloadPending, runOptimistic],
  );

  // ----- Bài tập: thêm mới -----
  const createAssignment = useCallback(
    async (input: NewAssignmentInput): Promise<MutationResult> => {
      const now = new Date().toISOString();
      const body = {
        courseId: input.courseId,
        title: input.title.trim(),
        description: input.description.trim(),
        dueDate: input.dueDate,
        status: 'todo' as const,
        updatedAt: now,
      };
      const localId = `${LOCAL_ID_PREFIX}${Date.now()}`;
      const meta: OutboxMeta = { entity: 'assignments', localId, label: `Bài tập "${body.title}"` };

      if (!onlineRef.current) {
        await outbox.enqueue({ method: 'POST', url: '/assignments', body, meta });
        await reloadPending();
        return { queued: true };
      }

      await runOptimistic(
        { id: `inflight-${localId}`, method: 'POST', url: '/assignments', body, createdAt: now, meta },
        () => assignmentService.create(body),
        created =>
          assignmentsQuery.mutate(list => [
            ...(list ?? []),
            attachCourse(created, queriesRef.current.courses.data),
          ]),
      );
      return { queued: false };
    },
    [assignmentsQuery, reloadPending, runOptimistic],
  );

  // ----- Sinh viên: sửa thông tin -----
  const updateStudent = useCallback(
    async (changes: StudentChanges): Promise<MutationResult> => {
      const updatedAt = new Date().toISOString();
      const body = { ...changes, updatedAt };
      const url = `/students/${CURRENT_STUDENT_ID}`;

      if (!onlineRef.current) {
        const existing = pendingRef.current.find(
          action => action.method === 'PATCH' && action.meta?.entity === 'student',
        );
        if (existing) {
          await outbox.update(existing.id, { body: { ...existing.body, ...body } });
        } else {
          await outbox.enqueue({
            method: 'PATCH',
            url,
            body,
            meta: {
              entity: 'student',
              entityId: CURRENT_STUDENT_ID,
              baseUpdatedAt: studentQuery.data?.updatedAt,
              label: 'Thông tin cá nhân',
            },
          });
        }
        await reloadPending();
        return { queued: true };
      }

      try {
        await runOptimistic(
          {
            id: `inflight-student-${Date.now()}`,
            method: 'PATCH',
            url,
            body,
            createdAt: updatedAt,
            meta: { entity: 'student', entityId: CURRENT_STUDENT_ID },
          },
          () => studentService.update(CURRENT_STUDENT_ID, body),
          updated =>
            studentQuery.mutate(
              prev => (prev ? { ...prev, ...updated } : (updated as Student)),
              true,
            ),
        );
        return { queued: false };
      } catch {
        await outbox.enqueue({
          method: 'PATCH',
          url,
          body,
          meta: {
            entity: 'student',
            entityId: CURRENT_STUDENT_ID,
            baseUpdatedAt: studentQuery.data?.updatedAt,
            label: 'Thông tin cá nhân',
          },
        });
        await reloadPending();
        return { queued: true };
      }
    },
    [reloadPending, runOptimistic, studentQuery],
  );

  // ----- Sau khi đồng bộ một thao tác -----
  const applyServerRecord = useCallback((action: OutboxAction, record: unknown) => {
    if (!record || typeof record !== 'object') {
      return;
    }
    const all = queriesRef.current;
    if (action.meta?.entity === 'student') {
      all.student.mutate(record as Student, true);
      return;
    }
    if (action.meta?.entity === 'assignments') {
      const saved = attachCourse(record as Assignment, all.courses.data);
      all.assignments.mutate(list => {
        const items = list ?? [];
        return items.some(item => sameId(item.id, saved.id))
          ? items.map(item => (sameId(item.id, saved.id) ? { ...item, ...saved } : item))
          : [...items, saved];
      });
    }
  }, []);

  const status = useMemo(
    () => ({
      student: toStatus(studentQuery),
      courses: toStatus(coursesQuery),
      sessions: toStatus(sessionsQuery),
      assignments: toStatus(assignmentsQuery),
      grades: toStatus(gradesQuery),
    }),
    [studentQuery, coursesQuery, sessionsQuery, assignmentsQuery, gradesQuery],
  );

  const value = useMemo<AppDataValue>(
    () => ({
      student,
      courses,
      sessions: sessionsQuery.data,
      assignments,
      grades: gradesQuery.data,
      status,
      isOnline,
      pendingActions,
      refresh,
      refreshAll,
      reloadPending,
      isPending,
      toggleAssignmentStatus,
      createAssignment,
      updateStudent,
      applyServerRecord,
    }),
    [
      student,
      courses,
      sessionsQuery.data,
      assignments,
      gradesQuery.data,
      status,
      isOnline,
      pendingActions,
      refresh,
      refreshAll,
      reloadPending,
      isPending,
      toggleAssignmentStatus,
      createAssignment,
      updateStudent,
      applyServerRecord,
    ],
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData(): AppDataValue {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('useAppData phải được dùng bên trong AppDataProvider.');
  }
  return context;
}
