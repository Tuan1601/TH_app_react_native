/**
 * AuthContext: quản lý phiên đăng nhập toàn ứng dụng bằng onAuthStateChanged()
 * và tự động bật/tắt hệ thống Presence (online/offline) khi trạng thái đăng nhập thay đổi.
 */
import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { User } from 'firebase/auth';
import {
  loginUser,
  logoutUser,
  observeAuthState,
  registerUser,
} from '../services/authService';
import { setupPresence } from '../services/presenceService';
import { createUserProfile, listenToUserProfile } from '../services/userService';
import type {
  LoginPayload,
  RegisterPayload,
  UserProfile,
} from '../types/user';

export interface AuthContextValue {
  firebaseUser: User | null;
  userProfile: UserProfile | null;
  initializing: boolean;
  isConnected: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);

function createFallbackFromAuthUser(user: User): UserProfile {
  const now = Date.now();
  return {
    uid: user.uid,
    fullName:
      user.displayName?.trim() || (user.email ?? 'Người dùng').split('@')[0],
    email: user.email ?? '',
    avatar: user.photoURL ?? '',
    isOnline: true,
    lastSeen: now,
    createdAt: now,
  };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [initializing, setInitializing] = useState<boolean>(true);
  const [isConnected, setIsConnected] = useState<boolean>(true);

  // 1. Theo dõi trạng thái xác thực Firebase Auth
  useEffect(() => {
    const unsubscribeAuth = observeAuthState(user => {
      setFirebaseUser(user);
      if (!user) {
        setUserProfile(null);
      } else {
        setUserProfile(prev => prev ?? createFallbackFromAuthUser(user));
      }
      setInitializing(false);
    });
    return () => {
      unsubscribeAuth();
    };
  }, []);

  // 2. Khi đã có firebaseUser, lắng nghe hồ sơ /users/{uid} và bật Presence System
  useEffect(() => {
    if (!firebaseUser) {
      return;
    }

    const uid = firebaseUser.uid;
    let isMounted = true;
    let unsubscribePresence: (() => void) | null = null;

    const startPresenceOnce = () => {
      if (!unsubscribePresence && isMounted) {
        unsubscribePresence = setupPresence(uid, connected => {
          if (isMounted) {
            setIsConnected(connected);
          }
        });
      }
    };

    const unsubscribeProfile = listenToUserProfile(
      uid,
      profile => {
        if (!isMounted) {
          return;
        }
        if (profile) {
          setUserProfile(profile);
          startPresenceOnce();
        } else {
          const fallback = createFallbackFromAuthUser(firebaseUser);
          setUserProfile(fallback);
          createUserProfile({
            uid,
            fullName: fallback.fullName,
            email: fallback.email,
          })
            .then(() => {
              startPresenceOnce();
            })
            .catch(() => undefined);
        }
      },
      () => {
        if (isMounted) {
          setUserProfile(prev => prev ?? createFallbackFromAuthUser(firebaseUser));
        }
      },
    );

    return () => {
      isMounted = false;
      unsubscribeProfile();
      if (unsubscribePresence) {
        unsubscribePresence();
      }
    };
  }, [firebaseUser]);

  const login = useCallback(async (payload: LoginPayload) => {
    const profile = await loginUser(payload);
    setUserProfile(profile);
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    const profile = await registerUser(payload);
    setUserProfile(profile);
  }, []);

  const logout = useCallback(async () => {
    if (!firebaseUser) {
      return;
    }
    await logoutUser(firebaseUser.uid);
  }, [firebaseUser]);

  const value = useMemo<AuthContextValue>(
    () => ({
      firebaseUser,
      userProfile,
      initializing,
      isConnected,
      login,
      register,
      logout,
    }),
    [
      firebaseUser,
      userProfile,
      initializing,
      isConnected,
      login,
      register,
      logout,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
