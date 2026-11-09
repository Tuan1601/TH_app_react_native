/**
 * userService: thao tác với hồ sơ người dùng tại /users/{uid}.
 */
import {
  get,
  onValue,
  ref,
  serverTimestamp,
  set,
  update,
  type Unsubscribe,
} from 'firebase/database';
import type { UpdateProfilePayload, UserProfile } from '../types/user';
import { APP_CONFIG } from '../constants/config';
import { toAppError, getErrorMessage } from '../utils/errorUtils';
import { db, DB_PATHS } from './firebase';

/** Dữ liệu thô đọc từ database (có thể thiếu trường). */
type RawUser = Partial<UserProfile> | null | undefined;

/**
 * Chuyển dữ liệu thô từ Firebase thành UserProfile đầy đủ kiểu.
 * Trả về null nếu dữ liệu không hợp lệ (thiếu fullName).
 */
export function toUserProfile(uid: string, raw: RawUser): UserProfile | null {
  if (!raw || typeof raw.fullName !== 'string') {
    return null;
  }
  return {
    uid,
    fullName: raw.fullName,
    email: typeof raw.email === 'string' ? raw.email : '',
    avatar: typeof raw.avatar === 'string' ? raw.avatar : '',
    isOnline: raw.isOnline === true,
    lastSeen: typeof raw.lastSeen === 'number' ? raw.lastSeen : 0,
    createdAt: typeof raw.createdAt === 'number' ? raw.createdAt : 0,
  };
}

export interface CreateUserProfileParams {
  uid: string;
  fullName: string;
  email: string;
  avatar?: string;
}

/**
 * Tạo hồ sơ người dùng mới tại /users/{uid} ngay sau khi đăng ký.
 * Thời gian dùng serverTimestamp() để đồng nhất giữa các máy.
 * Không lưu mật khẩu, vì Firebase Authentication đã quản lý mật khẩu.
 */
export async function createUserProfile(
  params: CreateUserProfileParams,
): Promise<UserProfile> {
  try {
    await set(ref(db, DB_PATHS.user(params.uid)), {
      uid: params.uid,
      fullName: params.fullName.trim(),
      email: params.email.trim().toLowerCase(),
      avatar: params.avatar ?? '',
      isOnline: true,
      lastSeen: serverTimestamp(),
      createdAt: serverTimestamp(),
    });
    const profile = await getUserProfile(params.uid);
    if (!profile) {
      throw new Error('Không đọc lại được hồ sơ vừa tạo.');
    }
    return profile;
  } catch (error) {
    throw toAppError(error, 'Không thể tạo hồ sơ người dùng.');
  }
}

/**
 * Đọc hồ sơ một người dùng (đọc một lần, không realtime).
 * @returns UserProfile hoặc null nếu chưa có hồ sơ.
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const snapshot = await get(ref(db, DB_PATHS.user(uid)));
    return toUserProfile(uid, snapshot.val() as RawUser);
  } catch (error) {
    throw toAppError(error, 'Không thể tải thông tin người dùng.');
  }
}

/**
 * Lắng nghe realtime danh sách tất cả người dùng (trừ tài khoản hiện tại).
 * Tự cập nhật khi có người đăng ký mới hoặc đổi trạng thái online.
 * @returns hàm unsubscribe, BẮT BUỘC gọi trong cleanup của useEffect.
 */
export function listenToUsers(
  currentUid: string,
  onData: (users: UserProfile[]) => void,
  onError?: (message: string) => void,
): Unsubscribe {
  return onValue(
    ref(db, DB_PATHS.users),
    snapshot => {
      const raw = (snapshot.val() ?? {}) as Record<string, RawUser>;
      const users = Object.keys(raw)
        .filter(uid => uid !== currentUid)
        .map(uid => toUserProfile(uid, raw[uid]))
        .filter((user): user is UserProfile => user !== null)
        .sort((a, b) => a.fullName.localeCompare(b.fullName, 'vi'));
      onData(users);
    },
    error => onError?.(getErrorMessage(error, 'Không thể tải danh bạ.')),
  );
}

/**
 * Lắng nghe realtime hồ sơ của MỘT người dùng (dùng cho AuthContext, Settings).
 * @returns hàm unsubscribe.
 */
export function listenToUserProfile(
  uid: string,
  onData: (profile: UserProfile | null) => void,
  onError?: (message: string) => void,
): Unsubscribe {
  return onValue(
    ref(db, DB_PATHS.user(uid)),
    snapshot => onData(toUserProfile(uid, snapshot.val() as RawUser)),
    error => onError?.(getErrorMessage(error, 'Không thể tải hồ sơ.')),
  );
}

/**
 * Cập nhật hồ sơ của chính mình (họ tên, avatar).
 * Security Rules chỉ cho phép sửa /users/{uid} khi uid === auth.uid.
 */
export async function updateUserProfile(
  uid: string,
  payload: UpdateProfilePayload,
): Promise<void> {
  const changes: UpdateProfilePayload = {};

  if (payload.fullName !== undefined) {
    const fullName = payload.fullName.trim();
    if (!fullName || fullName.length > APP_CONFIG.FULL_NAME_MAX_LENGTH) {
      throw new Error(
        `Họ và tên phải từ 1 đến ${APP_CONFIG.FULL_NAME_MAX_LENGTH} ký tự.`,
      );
    }
    changes.fullName = fullName;
  }
  if (payload.avatar !== undefined) {
    changes.avatar = payload.avatar.trim();
  }
  if (Object.keys(changes).length === 0) {
    return;
  }

  try {
    await update(ref(db, DB_PATHS.user(uid)), changes);
  } catch (error) {
    throw toAppError(error, 'Không thể cập nhật hồ sơ.');
  }
}

