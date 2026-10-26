import AsyncStorage from '@react-native-async-storage/async-storage';
import type { CacheEntry } from '../types/models';

/** Đọc cache: trả về { data, savedAt } hoặc null. */
export async function getCache<T>(key: string): Promise<CacheEntry<T> | null> {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? (JSON.parse(value) as CacheEntry<T>) : null;
  } catch {
    return null;
  }
}

/** Ghi cache kèm thời điểm lưu. */
export async function setCache<T>(key: string, data: T): Promise<CacheEntry<T>> {
  const entry: CacheEntry<T> = { data, savedAt: new Date().toISOString() };
  await AsyncStorage.setItem(key, JSON.stringify(entry));
  return entry;
}

/** Ghi đè dữ liệu nhưng giữ nguyên savedAt cũ (dùng cho cập nhật lạc quan). */
export async function patchCache<T>(key: string, data: T): Promise<void> {
  const current = await getCache<T>(key);
  const entry: CacheEntry<T> = { data, savedAt: current?.savedAt ?? new Date().toISOString() };
  await AsyncStorage.setItem(key, JSON.stringify(entry));
}
