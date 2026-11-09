/**
 * Cấu hình ứng dụng.
 *
 * FIREBASE_CONFIG: lấy tại Firebase Console → Project settings → Your apps
 * → Web app (</>) → SDK setup and configuration → Config.
 */
import type { FirebaseOptions } from 'firebase/app';

export const FIREBASE_CONFIG: FirebaseOptions = {
  apiKey: 'AIzaSyClP38l_KLZdimujICA9UxnSeUxVFSCpI0',
  authDomain: 'chatapp-effd8.firebaseapp.com',
  databaseURL: 'https://chatapp-effd8-default-rtdb.firebaseio.com',
  projectId: 'chatapp-effd8',
  storageBucket: 'chatapp-effd8.firebasestorage.app',
  messagingSenderId: '374166027723',
  appId: '1:374166027723:web:5fa56064c84de4c78c0a4e',
  measurementId: 'G-MH6EFMFTMP',
};

/** true khi đã thay hết giá trị mẫu "YOUR_..." bằng config thật. */
export function isFirebaseConfigured(): boolean {
  return !Object.values(FIREBASE_CONFIG).some(
    value => typeof value === 'string' && value.includes('YOUR_'),
  );
}

/** Các hằng số nghiệp vụ dùng chung. */
export const APP_CONFIG = {
  FULL_NAME_MAX_LENGTH: 50,
  PASSWORD_MIN_LENGTH: 6,
  MESSAGE_MAX_LENGTH: 1000,
  /** Số tin nhắn gần nhất được tải khi mở một cuộc trò chuyện. */
  MESSAGE_LOAD_LIMIT: 200,
  LOCATION_TIMEOUT_MS: 15000,
  LOCATION_MAX_AGE_MS: 10000,
} as const;
