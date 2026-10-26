import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react';
import { Alert } from 'react-native';
import { request } from '../api/client';
import { useAppData } from './AppDataContext';
import useNetworkStatus from '../hooks/useNetworkStatus';
import * as outbox from '../storage/outbox';

export interface SyncContextValue {
  isOnline: boolean;
  pendingCount: number;
  syncing: boolean;
  syncNow: () => Promise<void>;
}

const SyncContext = createContext<SyncContextValue | null>(null);

export function SyncProvider({ children }: PropsWithChildren) {
  const { isOnline } = useNetworkStatus();
  const { reloadPending, refresh, applyServerRecord, pendingActions } = useAppData();
  const [syncing, setSyncing] = useState(false);
  const previousOnline = useRef(isOnline);
  const syncInProgress = useRef(false);

  const syncNow = useCallback(async () => {
    if (!isOnline || syncInProgress.current) {
      return;
    }
    syncInProgress.current = true;
    setSyncing(true);

    let completed = 0;
    const conflicts: string[] = [];
    const refreshNeeded = new Set<'student' | 'assignments'>();

    try {
      const actions = await outbox.getAll();
      for (const action of actions) {
        try {
          // B5. Xử lý xung đột:
          // Nếu thao tác sửa (PATCH) có baseUpdatedAt, đối chiếu với dữ liệu hiện tại trên server.
          // Nếu server đã có updatedAt mới hơn thời điểm sửa offline, ưu tiên server.
          if (action.method === 'PATCH' && action.meta?.baseUpdatedAt) {
            try {
              const currentServer = await request<{ updatedAt?: string }>('GET', action.url);
              const serverTime = new Date(currentServer.updatedAt || 0).getTime();
              const baseTime = new Date(action.meta.baseUpdatedAt).getTime();
              if (serverTime > baseTime) {
                // Xung đột: server mới hơn! Bỏ thao tác offline, giữ dữ liệu server.
                await outbox.remove(action.id);
                conflicts.push(action.meta.label || action.url);
                if (action.meta.entity === 'student' || action.meta.entity === 'assignments') {
                  refreshNeeded.add(action.meta.entity);
                }
                continue;
              }
            } catch {
              // Nếu không lấy được để so sánh thì thử thực hiện gửi bình thường
            }
          }

          const response = await request(action.method, action.url, action.body);
          await outbox.remove(action.id);
          completed += 1;
          applyServerRecord(action, response);

          if (action.meta?.entity === 'student' || action.meta?.entity === 'assignments') {
            refreshNeeded.add(action.meta.entity);
          }
        } catch (error) {
          console.warn('Lỗi khi gửi thao tác:', action, error);
          // Gặp lỗi thì dừng chu kỳ hiện tại, giữ lại các thao tác sau để thử lại
          break;
        }
      }

      await reloadPending();

      for (const entity of refreshNeeded) {
        await refresh(entity).catch(() => null);
      }

      if (completed > 0 || conflicts.length > 0) {
        const messages: string[] = [];
        if (completed > 0) {
          messages.push(`Đã đồng bộ ${completed} thay đổi lên máy chủ.`);
        }
        if (conflicts.length > 0) {
          messages.push(
            `Phát hiện xung đột ở: ${conflicts.join(', ')}. Dữ liệu mới hơn trên máy chủ được ưu tiên.`,
          );
        }
        Alert.alert('Đồng bộ dữ liệu', messages.join('\n\n'));
      }
    } catch (err) {
      console.warn('Lỗi đồng bộ:', err);
    } finally {
      syncInProgress.current = false;
      setSyncing(false);
    }
  }, [isOnline, reloadPending, refresh, applyServerRecord]);

  // Tự động đồng bộ khi chuyển trạng thái từ offline sang online
  useEffect(() => {
    if (isOnline && !previousOnline.current) {
      syncNow();
    }
    previousOnline.current = isOnline;
  }, [isOnline, syncNow]);

  const value = useMemo<SyncContextValue>(
    () => ({
      isOnline,
      pendingCount: pendingActions.length,
      syncing,
      syncNow,
    }),
    [isOnline, pendingActions.length, syncing, syncNow],
  );

  return <SyncContext.Provider value={value}>{children}</SyncContext.Provider>;
}

export function useSync(): SyncContextValue {
  const context = useContext(SyncContext);
  if (!context) {
    throw new Error('useSync phải được dùng bên trong SyncProvider.');
  }
  return context;
}
