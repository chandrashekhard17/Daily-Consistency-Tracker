/**
 * In-memory client-side data cache with Stale-While-Revalidate (SWR) support.
 * Prevents redundant database queries on every navigation event.
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  userId: string;
}

const cacheStore = new Map<string, CacheEntry<any>>();

// Cache TTL: 30 seconds
const DEFAULT_TTL_MS = 30000;

export function getCachedData<T>(key: string, currentUserId: string): T | null {
  const entry = cacheStore.get(key);
  if (!entry) return null;
  if (entry.userId !== currentUserId) {
    cacheStore.delete(key);
    return null;
  }
  const isExpired = Date.now() - entry.timestamp > DEFAULT_TTL_MS;
  if (isExpired) return null;
  return entry.data as T;
}

export function setCachedData<T>(key: string, currentUserId: string, data: T): void {
  cacheStore.set(key, {
    data,
    timestamp: Date.now(),
    userId: currentUserId,
  });
}

export function invalidateCacheKey(key: string): void {
  cacheStore.delete(key);
}

export function clearAllDataCache(): void {
  cacheStore.clear();
}
