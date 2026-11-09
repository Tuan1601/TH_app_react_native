/**
 * notificationService: đọc và cập nhật thông báo tại /notifications/{uid}.
 * Phục vụ màn hình NotificationsScreen (giữ lại tab Thông báo từ Bài thực hành 4).
 */
import {
  limitToLast,
  onValue,
  orderByChild,
  push,
  query,
  ref,
  serverTimestamp,
  set,
  update,
  type Unsubscribe,
} from 'firebase/database';
import type {
  AppNotification,
  NotificationType,
} from '../types/notification';
import { getErrorMessage, toAppError } from '../utils/errorUtils';
import { db, DB_PATHS } from './firebase';

function parseNotification(
  id: string,
  raw: Record<string, unknown> | null | undefined,
): AppNotification | null {
  if (!raw || typeof raw !== 'object') {
    return null;
  }
  if (typeof raw.title !== 'string' || typeof raw.body !== 'string') {
    return null;
  }
  const type: NotificationType =
    raw.type === 'new_conversation' ? 'new_conversation' : 'system';
  return {
    id,
    type,
    title: raw.title,
    body: raw.body,
    read: raw.read === true,
    createdAt: typeof raw.createdAt === 'number' ? raw.createdAt : 0,
    fromUid: typeof raw.fromUid === 'string' ? raw.fromUid : '',
    conversationId:
      typeof raw.conversationId === 'string' ? raw.conversationId : undefined,
  };
}

/**
 * Lắng nghe realtime danh sách thông báo của người dùng hiện tại.
 */
export function listenToNotifications(
  uid: string,
  onData: (items: AppNotification[]) => void,
  onError?: (message: string) => void,
): Unsubscribe {
  const q = query(
    ref(db, DB_PATHS.notifications(uid)),
    orderByChild('createdAt'),
    limitToLast(50),
  );
  return onValue(
    q,
    snapshot => {
      const items: AppNotification[] = [];
      snapshot.forEach(child => {
        if (!child.key) {
          return;
        }
        const parsed = parseNotification(
          child.key,
          child.val() as Record<string, unknown> | null,
        );
        if (parsed) {
          items.push(parsed);
        }
      });
      items.sort((a, b) => b.createdAt - a.createdAt);
      onData(items);
    },
    error => onError?.(getErrorMessage(error, 'Không thể tải thông báo.')),
  );
}

/**
 * Tạo thông báo chào mừng khi người dùng vừa đăng ký tài khoản mới.
 */
export async function createWelcomeNotification(
  uid: string,
  fullName: string,
): Promise<void> {
  try {
    const listRef = ref(db, DB_PATHS.notifications(uid));
    const newRef = push(listRef);
    if (!newRef.key) {
      return;
    }
    await set(newRef, {
      id: newRef.key,
      type: 'system',
      title: 'Chào mừng đến với ChatApp!',
      body: `Xin chào ${fullName}, tài khoản của bạn đã sẵn sàng để trò chuyện realtime.`,
      read: false,
      createdAt: serverTimestamp(),
      fromUid: uid,
    });
  } catch {
    // Không làm gián đoạn luồng đăng ký nếu ghi thông báo lỗi
  }
}

/**
 * Đánh dấu một thông báo là đã đọc.
 */
export async function markNotificationAsRead(
  uid: string,
  notificationId: string,
): Promise<void> {
  try {
    await update(ref(db, DB_PATHS.notification(uid, notificationId)), {
      read: true,
    });
  } catch (error) {
    throw toAppError(error, 'Không thể cập nhật thông báo.');
  }
}

