
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type Unsubscribe,
  type User,
} from 'firebase/auth';
import type { LoginPayload, RegisterPayload, UserProfile } from '../types/user';
import { normalizeEmail } from '../utils/validation';
import { toAppError } from '../utils/errorUtils';
import { auth } from './firebase';
import { createUserProfile, getUserProfile } from './userService';
import { updateOfflineStatus } from './presenceService';
import { createWelcomeNotification } from './notificationService';

function buildFallbackProfile(user: User, fullNameOverride?: string): UserProfile {
  const now = Date.now();
  const fullName =
    fullNameOverride?.trim() ||
    user.displayName?.trim() ||
    (user.email ?? 'Người dùng').split('@')[0];
  return {
    uid: user.uid,
    fullName,
    email: user.email ?? '',
    avatar: user.photoURL ?? '',
    isOnline: true,
    lastSeen: now,
    createdAt: now,
  };
}


export async function registerUser(
  payload: RegisterPayload,
): Promise<UserProfile> {
  const email = normalizeEmail(payload.email);
  const fullName = payload.fullName.trim();

  let user: User;
  try {
    const credential = await createUserWithEmailAndPassword(
      auth,
      email,
      payload.password,
    );
    user = credential.user;
  } catch (error) {
    throw toAppError(error, 'Đăng ký thất bại. Vui lòng thử lại.');
  }

  await updateProfile(user, { displayName: fullName }).catch(() => undefined);

  try {
    const profile = await createUserProfile({
      uid: user.uid,
      fullName,
      email,
    });
    await createWelcomeNotification(user.uid, fullName);
    return profile;
  } catch (dbError) {
    console.warn('[auth] Chưa ghi được hồ sơ vào Realtime Database:', dbError);
    return buildFallbackProfile(user, fullName);
  }
}

export async function loginUser(payload: LoginPayload): Promise<UserProfile> {
  let user: User;
  try {
    const credential = await signInWithEmailAndPassword(
      auth,
      normalizeEmail(payload.email),
      payload.password,
    );
    user = credential.user;
  } catch (error) {
    throw toAppError(error, 'Đăng nhập thất bại. Vui lòng thử lại.');
  }

  try {
    const profile = await getUserProfile(user.uid);
    if (profile) {
      return profile;
    }
    return await createUserProfile({
      uid: user.uid,
      fullName: user.displayName || (user.email ?? 'Người dùng').split('@')[0],
      email: user.email ?? '',
    });
  } catch (dbError) {
    console.warn('[auth] Không đọc/tạo được hồ sơ trên Database:', dbError);
    return buildFallbackProfile(user);
  }
}


export async function logoutUser(uid: string): Promise<void> {
  try {
    await updateOfflineStatus(uid);
  } catch (error) {
    console.warn('[auth] Không ghi được trạng thái offline:', error);
  }
  try {
    await signOut(auth);
  } catch (error) {
    throw toAppError(error, 'Đăng xuất thất bại. Vui lòng thử lại.');
  }
}


export function observeAuthState(
  callback: (user: User | null) => void,
): Unsubscribe {
  return onAuthStateChanged(auth, callback);
}
