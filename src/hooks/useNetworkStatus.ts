import { useSyncExternalStore } from 'react';
import NetInfo, { type NetInfoState } from '@react-native-community/netinfo';

// Một kết nối NetInfo duy nhất dùng chung cho toàn ứng dụng.
// null = chưa biết trạng thái (vừa mở app).
let current: boolean | null = null;
let started = false;
const listeners = new Set<() => void>();

function toOnline(state: NetInfoState): boolean | null {
  if (state.isConnected === null || state.isConnected === undefined) {
    return current;
  }
  return state.isConnected;
}

function start() {
  if (started) {
    return;
  }
  started = true;
  NetInfo.addEventListener(state => {
    const next = toOnline(state);
    if (next !== current) {
      current = next;
      listeners.forEach(listener => listener());
    }
  });
}

function subscribe(listener: () => void) {
  start();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

const getSnapshot = () => current;

/**
 * Theo dõi trạng thái mạng.
 * - isOnline: true khi có kết nối (mặc định coi là online khi chưa biết)
 * - isKnown: đã nhận được trạng thái thật từ NetInfo hay chưa
 */
export default function useNetworkStatus(): { isOnline: boolean; isKnown: boolean } {
  const value = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  return { isOnline: value !== false, isKnown: value !== null };
}
