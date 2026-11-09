
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


type RawUser = Partial<UserProfile> | null | undefined;


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


export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const snapshot = await get(ref(db, DB_PATHS.user(uid)));
    return toUserProfile(uid, snapshot.val() as RawUser);
  } catch (error) {
    throw toAppError(error, 'Không thể tải thông tin người dùng.');
  }
}


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

