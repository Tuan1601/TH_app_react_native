/**
 * authService: đăng ký, đăng nhập, đăng xuất bằng Firebase Authentication.
 * Mật khẩu chỉ được gửi tới Firebase Auth, KHÔNG BAO GIỜ lưu vào Database.
 */
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

/**
 * Đăng ký tài khoản mới.
 * 1. createUserWithEmailAndPassword() → Firebase Auth tạo tài khoản, trả về UID.
 * 2. Lưu displayName vào Auth.
 * 3. Tạo hồ sơ /users/{uid}.
 * Lưu ý: KHÔNG gọi deleteUser() nếu bước 3 bị lỗi Rules để tránh làm văng
 * người dùng ngược ra màn hình Login sau khi onAuthStateChanged đã kích hoạt.
 */
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

/**
 * Đăng nhập bằng email/mật khẩu, sau đó lấy hồ sơ từ Realtime Database.
 * Nếu tài khoản cũ chưa có hồ sơ thì tạo bù để app không bị lỗi.
 */
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

/**
 * Đăng xuất: ghi offline TRƯỚC, sau đó mới signOut().
 * Phải theo thứ tự này vì sau signOut không còn quyền ghi vào /userStatus.
 */
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

/**
 * Theo dõi trạng thái đăng nhập toàn app (onAuthStateChanged).
 */
export function observeAuthState(
  callback: (user: User | null) => void,
): Unsubscribe {
  return onAuthStateChanged(auth, callback);
}
