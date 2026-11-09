
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

function buildStatus(state: PresenceState) {
  return { state, lastChanged: serverTimestamp() };
}

function buildUserPresence(isOnline: boolean) {
  return { isOnline, lastSeen: serverTimestamp() };
}


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

      return;
    }

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


function toUserStatus(raw: Partial<UserStatus> | null): UserStatus | null {
  if (!raw || (raw.state !== 'online' && raw.state !== 'offline')) {
    return null;
  }
  return {
    state: raw.state,
    lastChanged: typeof raw.lastChanged === 'number' ? raw.lastChanged : 0,
  };
}


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

