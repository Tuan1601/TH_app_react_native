/**
 * Khởi tạo Firebase dùng chung cho toàn app.
 *
 * Lưu ý với @react-native-async-storage/async-storage v3 và @firebase/auth:
 * - Theo tài liệu trong @firebase/auth/dist/rn/index.js, với AsyncStorage v3
 *   ta dùng createAsyncStorage('chatapp-auth') truyền vào getReactNativePersistence().
 */
import { createAsyncStorage } from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import {
  getAuth,
  getReactNativePersistence,
  initializeAuth,
  type Auth,
} from 'firebase/auth';
import { getDatabase, type Database } from 'firebase/database';
import { FIREBASE_CONFIG } from '../constants/config';

const authStorage = createAsyncStorage('chatapp-auth');

function getOrCreateFirebaseApp(): FirebaseApp {
  const keySuffix = (FIREBASE_CONFIG.apiKey ?? 'default').slice(-6);
  const appName = `chatapp-${FIREBASE_CONFIG.projectId ?? 'app'}-${keySuffix}`;
  const existing = getApps().find(item => item.name === appName);
  if (existing) {
    return getApp(appName);
  }
  return initializeApp(FIREBASE_CONFIG, appName);
}

function createAuth(app: FirebaseApp): Auth {
  try {
    return initializeAuth(app, {
      persistence: getReactNativePersistence(authStorage),
    });
  } catch {
    return getAuth(app);
  }
}

export const firebaseApp: FirebaseApp = getOrCreateFirebaseApp();

export const auth: Auth = createAuth(firebaseApp);

export const db: Database = getDatabase(
  firebaseApp,
  FIREBASE_CONFIG.databaseURL,
);

/**
 * Tập trung toàn bộ đường dẫn database vào một chỗ để tránh gõ sai chuỗi
 * và không lặp code giữa các service.
 */
export const DB_PATHS = {
  connected: '.info/connected',
  users: 'users',
  user: (uid: string) => `users/${uid}`,
  userStatus: (uid: string) => `userStatus/${uid}`,
  conversation: (conversationId: string) => `conversations/${conversationId}`,
  userConversations: (uid: string) => `userConversations/${uid}`,
  messages: (conversationId: string) => `messages/${conversationId}`,
  message: (conversationId: string, messageId: string) =>
    `messages/${conversationId}/${messageId}`,
  unreadCounts: (uid: string) => `unreadCounts/${uid}`,
  unreadCount: (uid: string, conversationId: string) =>
    `unreadCounts/${uid}/${conversationId}`,
  notifications: (uid: string) => `notifications/${uid}`,
  notification: (uid: string, notificationId: string) =>
    `notifications/${uid}/${notificationId}`,
} as const;
