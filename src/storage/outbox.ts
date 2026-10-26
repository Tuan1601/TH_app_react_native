import AsyncStorage from '@react-native-async-storage/async-storage';
import { OUTBOX_KEY } from './keys';
import type { NewOutboxAction, OutboxAction } from '../types/models';

// Chuỗi promise để các thao tác đọc-sửa-ghi không chồng lên nhau.
let queue: Promise<unknown> = Promise.resolve();
function serialize<T>(task: () => Promise<T>): Promise<T> {
  const run = queue.then(task, task);
  queue = run.catch(() => undefined);
  return run;
}

async function read(): Promise<OutboxAction[]> {
  try {
    const raw = await AsyncStorage.getItem(OUTBOX_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function write(actions: OutboxAction[]): Promise<void> {
  await AsyncStorage.setItem(OUTBOX_KEY, JSON.stringify(actions));
}

/** Lấy toàn bộ hàng đợi theo đúng thứ tự thêm vào. */
export function getAll(): Promise<OutboxAction[]> {
  return serialize(read);
}

/** Thêm thao tác vào cuối hàng đợi: { id, method, url, body, createdAt }. */
export function enqueue(action: NewOutboxAction): Promise<OutboxAction> {
  return serialize(async () => {
    const actions = await read();
    const entry: OutboxAction = {
      ...action,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: new Date().toISOString(),
    };
    await write([...actions, entry]);
    return entry;
  });
}

/** Xóa thao tác khỏi hàng đợi. */
export function remove(id: string): Promise<void> {
  return serialize(async () => {
    const actions = await read();
    await write(actions.filter(item => item.id !== id));
  });
}

/** Cập nhật một thao tác đang chờ (ví dụ đổi trạng thái của bài tập vừa tạo offline). */
export function update(id: string, changes: Partial<OutboxAction>): Promise<void> {
  return serialize(async () => {
    const actions = await read();
    await write(actions.map(item => (item.id === id ? { ...item, ...changes } : item)));
  });
}
