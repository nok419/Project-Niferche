// src/utils/cache.tsx
const CACHE_DURATION = 1000 * 60 * 5; // 5分

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

export class ContentCache {
  private static cache = new Map<string, CacheEntry<any>>();

  static set<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  static get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const isExpired = Date.now() - entry.timestamp > CACHE_DURATION;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }
}