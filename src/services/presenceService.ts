/**
 * presenceService: hệ thống Online/Offline realtime (Presence System).
 *
 * Nguyên lý:
 * 1. Lắng nghe /.info/connected, node đặc biệt do Firebase cung cấp.
 *    Nó có giá trị true khi app đang kết nối tới server, false khi mất kết nối.
 * 2. Mỗi lần kết nối thành công, ta ĐĂNG KÝ TRƯỚC với server các thao tác
 *    onDisconnect() (ghi trạng thái offline), rồi mới ghi trạng thái online.
 * 3. Khi app bị đóng đột ngột hoặc mất mạng, chính SERVER sẽ thực hiện các
 *    thao tác đã đăng ký, nên trạng thái không bị kẹt ở "online".
 *    Vì vậy không cần (và không nên) chỉ dựa vào AppState.
 *
 * Trạng thái được ghi vào 2 nơi:
 * - /userStatus/{uid}: { state, lastChanged }, dùng cho header ChatScreen.
 * - /users/{uid}/isOnline, lastSeen: giúp ContactsScreen chỉ cần nghe /users.
 */
import {
  onDisconnect,
  onValue,
  ref,
  serverTimestamp,
  set,
  update,
  type Unsubscribe,
} from 'firebase/database';
import type { PresenceState, UserStatus } from '../types/user';
import { getErrorMessage, toAppError } from '../utils/errorUtils';
import { db, DB_PATHS } from './firebase';

/** Tạo dữ liệu ghi cho /userStatus/{uid}. */
function buildStatus(state: PresenceState) {
  return { state, lastChanged: serverTimestamp() };
}

/** Tạo dữ liệu ghi cho /users/{uid} (chỉ 2 trường presence). */
function buildUserPresence(isOnline: boolean) {
  return { isOnline, lastSeen: serverTimestamp() };
}

/**
 * Bật presence cho người dùng đang đăng nhập.
 * Chỉ gọi khi hồ sơ /users/{uid} đã tồn tại (AuthContext đảm bảo điều này).
 *
 * @param uid UID người dùng hiện tại
 * @param onConnectionChange báo cho UI biết app đang online hay mất kết nối
 * @returns hàm unsubscribe, gọi khi đăng xuất hoặc unmount
 */
export function setupPresence(
  uid: string,
  onConnectionChange?: (connected: boolean) => void,
): Unsubscribe {
  const connectedRef = ref(db, DB_PATHS.connected);
  const statusRef = ref(db, DB_PATHS.userStatus(uid));
  const userRef = ref(db, DB_PATHS.user(uid));

  return onValue(connectedRef, snapshot => {
    const connected = snapshot.val() === true;
    onConnectionChange?.(connected);
    if (!connected) {
      // Đang mất kết nối: không ghi được gì. Server sẽ tự chạy onDisconnect.
      return;
    }

    // Bước 1: đăng ký onDisconnect với server. Bước 2: ghi online.
    // Phải đúng thứ tự này, nếu không có thể bị kẹt online khi app bị kill.
    Promise.all([
      onDisconnect(statusRef).set(buildStatus('offline')),
      onDisconnect(userRef).update(buildUserPresence(false)),
    ])
      .then(() =>
        Promise.all([
          set(statusRef, buildStatus('online')),
          update(userRef, buildUserPresence(true)),
        ]),
      )
      .catch(error => {
        console.warn('[presence] Không thể cập nhật trạng thái:', error);
      });
  });
}

/** Chuyển dữ liệu thô thành UserStatus. */
function toUserStatus(raw: Partial<UserStatus> | null): UserStatus | null {
  if (!raw || (raw.state !== 'online' && raw.state !== 'offline')) {
    return null;
  }
  return {
    state: raw.state,
    lastChanged: typeof raw.lastChanged === 'number' ? raw.lastChanged : 0,
  };
}

/**
 * Lắng nghe realtime trạng thái online/offline của một người dùng.
 * @returns hàm unsubscribe.
 */
export function listenToUserStatus(
  uid: string,
  onData: (status: UserStatus | null) => void,
  onError?: (message: string) => void,
): Unsubscribe {
  return onValue(
    ref(db, DB_PATHS.userStatus(uid)),
    snapshot =>
      onData(toUserStatus(snapshot.val() as Partial<UserStatus> | null)),
    error => onError?.(getErrorMessage(error, 'Không thể tải trạng thái.')),
  );
}

/**
 * Chủ động ghi offline, dùng khi ĐĂNG XUẤT (phải gọi TRƯỚC signOut()).
 * - Hủy các onDisconnect đã đăng ký, vì user đã chủ động offline.
 * - Ghi offline ngay để người khác thấy lập tức.
 */
export async function updateOfflineStatus(uid: string): Promise<void> {
  const statusRef = ref(db, DB_PATHS.userStatus(uid));
  const userRef = ref(db, DB_PATHS.user(uid));
  try {
    await Promise.all([
      onDisconnect(statusRef).cancel(),
      onDisconnect(userRef).cancel(),
    ]);
    await Promise.all([
      set(statusRef, buildStatus('offline')),
      update(userRef, buildUserPresence(false)),
    ]);
  } catch (error) {
    throw toAppError(error, 'Không thể cập nhật trạng thái offline.');
  }
}

