import { useCallback, useEffect, useRef, useState } from 'react';
import { getCache, patchCache, setCache } from '../storage/cache';
import useNetworkStatus from './useNetworkStatus';
import type { ApiError } from '../types/models';

export interface CachedQueryOptions {
  /** false: chỉ đọc cache, không gọi API (ví dụ bản ghi tạo offline chưa có trên server). */
  enabled?: boolean;
}

export interface CachedQueryResult<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
  refreshing: boolean;
  lastUpdated: string | null;
  /** Gọi lại API. pull = true khi kéo để làm mới. Trả về true nếu thành công. */
  refresh: (pull?: boolean) => Promise<boolean>;
  /** Sửa dữ liệu cục bộ và cache (dùng cho cập nhật lạc quan / sau khi đồng bộ). */
  mutate: (updater: T | null | ((previous: T | null) => T | null), fresh?: boolean) => void;
}

const OFFLINE_NO_CACHE: ApiError = {
  type: 'network',
  status: null,
  message: 'Bạn đang offline và chưa có dữ liệu được lưu trên máy.',
};

function toApiError(error: unknown): ApiError {
  if (typeof error === 'object' && error !== null && 'message' in error) {
    const value = error as Partial<ApiError>;
    return {
      type: value.type ?? 'network',
      status: value.status ?? null,
      message: String(value.message),
    };
  }
  return { type: 'network', status: null, message: 'Đã có lỗi không xác định.' };
}

/**
 * Chiến lược "cache trước, mạng sau":
 * 1. Hiển thị ngay dữ liệu trong AsyncStorage (nếu có).
 * 2. Nếu có mạng thì gọi API, lưu lại { data, savedAt } và cập nhật giao diện.
 * 3. Khi mạng quay lại thì tự tải lại.
 */
export default function useCachedQuery<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: CachedQueryOptions = {},
): CachedQueryResult<T> {
  const { enabled = true } = options;
  const { isOnline, isKnown } = useNetworkStatus();

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [cacheRead, setCacheRead] = useState(false);

  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;
  const dataRef = useRef<T | null>(null);
  const onlineRef = useRef(isOnline);
  onlineRef.current = isOnline;
  const requestIdRef = useRef(0);
  const keyRef = useRef(key);
  keyRef.current = key;

  const refresh = useCallback(
    async (pull = false): Promise<boolean> => {
      if (!enabled) {
        setLoading(false);
        return false;
      }
      if (!onlineRef.current) {
        setLoading(false);
        setRefreshing(false);
        if (dataRef.current === null) {
          setError(OFFLINE_NO_CACHE);
        }
        return false;
      }
      const requestId = ++requestIdRef.current;
      const requestKey = key;
      if (pull) {
        setRefreshing(true);
      } else if (dataRef.current === null) {
        setLoading(true);
      }
      try {
        const result = await fetcherRef.current();
        const entry = await setCache(requestKey, result);
        if (requestId !== requestIdRef.current || keyRef.current !== requestKey) {
          return true;
        }
        dataRef.current = result;
        setData(result);
        setLastUpdated(entry.savedAt);
        setError(null);
        return true;
      } catch (fetchError) {
        if (requestId === requestIdRef.current) {
          setError(toApiError(fetchError));
        }
        return false;
      } finally {
        if (requestId === requestIdRef.current) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    },
    [enabled, key],
  );

  // Bước 1: đọc cache mỗi khi đổi key.
  useEffect(() => {
    let active = true;
    dataRef.current = null;
    setData(null);
    setError(null);
    setLastUpdated(null);
    setLoading(true);
    setCacheRead(false);
    getCache<T>(key).then(entry => {
      if (!active) {
        return;
      }
      if (entry) {
        dataRef.current = entry.data;
        setData(entry.data);
        setLastUpdated(entry.savedAt);
        setLoading(false);
      }
      setCacheRead(true);
    });
    return () => {
      active = false;
    };
  }, [key]);

  // Bước 2: khi đã đọc cache và biết trạng thái mạng → gọi API hoặc báo lỗi offline.
  useEffect(() => {
    if (!cacheRead || !isKnown) {
      return;
    }
    if (!enabled) {
      setLoading(false);
      return;
    }
    if (isOnline) {
      refresh();
    } else {
      setLoading(false);
      if (dataRef.current === null) {
        setError(OFFLINE_NO_CACHE);
      }
    }
  }, [cacheRead, isKnown, isOnline, enabled, refresh]);

  const mutate = useCallback<CachedQueryResult<T>['mutate']>(
    (updater, fresh = false) => {
      const next =
        typeof updater === 'function'
          ? (updater as (previous: T | null) => T | null)(dataRef.current)
          : updater;
      dataRef.current = next;
      setData(next);
      if (next === null) {
        return;
      }
      if (fresh) {
        setCache(key, next).then(entry => setLastUpdated(entry.savedAt));
      } else {
        patchCache(key, next);
      }
    },
    [key],
  );

  return { data, loading, error, refreshing, lastUpdated, refresh, mutate };
}
