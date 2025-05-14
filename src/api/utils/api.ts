// File: src/api/utils/api.ts
import { ApiError } from '../../types/common';

// キャッシュの型定義
interface CacheItem<T> {
  data: T;
  expiry: number;
}

// キャッシュストレージ
const cache: Record<string, CacheItem<any>> = {};

/**
 * データをキャッシュに保存
 * @param key キャッシュキー
 * @param data 保存するデータ
 * @param expiryMinutes 有効期限（分）
 */
export const cacheData = <T>(key: string, data: T, expiryMinutes: number = 30): void => {
  const expiry = Date.now() + (expiryMinutes * 60 * 1000);
  cache[key] = { data, expiry };
  
  // ローカルストレージにも保存（オプション）
  try {
    localStorage.setItem(
      `niferche_cache_${key}`, 
      JSON.stringify({ data, expiry })
    );
  } catch (error) {
    console.warn('Failed to store in localStorage:', error);
  }
};

/**
 * キャッシュからデータを取得
 * @param key キャッシュキー
 * @returns キャッシュされたデータまたはnull
 */
export const getCachedData = <T>(key: string): T | null => {
  // メモリキャッシュをチェック
  const item = cache[key];
  
  if (item && item.expiry > Date.now()) {
    return item.data as T;
  }
  
  // メモリキャッシュになければローカルストレージをチェック
  try {
    const storedItem = localStorage.getItem(`niferche_cache_${key}`);
    if (storedItem) {
      const parsed = JSON.parse(storedItem) as CacheItem<T>;
      
      if (parsed && parsed.expiry > Date.now()) {
        // メモリキャッシュに戻す
        cache[key] = parsed;
        return parsed.data;
      } else {
        // 期限切れなら削除
        localStorage.removeItem(`niferche_cache_${key}`);
      }
    }
  } catch (error) {
    console.warn('Failed to retrieve from localStorage:', error);
  }
  
  return null;
};

/**
 * キャッシュを削除
 * @param key キャッシュキー
 */
export const clearCache = (key: string): void => {
  delete cache[key];
  try {
    localStorage.removeItem(`niferche_cache_${key}`);
  } catch (error) {
    console.warn('Failed to remove from localStorage:', error);
  }
};

/**
 * 指定のプレフィックスで始まるすべてのキャッシュを削除
 * @param prefix キャッシュキーのプレフィックス
 */
export const clearCacheByPrefix = (prefix: string): void => {
  // メモリキャッシュをクリア
  Object.keys(cache).forEach(key => {
    if (key.startsWith(prefix)) {
      delete cache[key];
    }
  });
  
  // ローカルストレージをクリア
  try {
    const localStoragePrefix = `niferche_cache_${prefix}`;
    const keysToRemove: string[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(localStoragePrefix)) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
  } catch (error) {
    console.warn('Failed to clear localStorage by prefix:', error);
  }
};

/**
 * 期限切れのキャッシュをすべて削除
 */
export const cleanupExpiredCache = (): void => {
  const now = Date.now();
  
  // メモリキャッシュをクリーンアップ
  Object.entries(cache).forEach(([key, item]) => {
    if (item.expiry < now) {
      delete cache[key];
    }
  });
  
  // ローカルストレージをクリーンアップ
  try {
    const keysToRemove: string[] = [];
    const prefix = 'niferche_cache_';
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(prefix)) {
        try {
          const item = JSON.parse(localStorage.getItem(key) || '{}');
          if (item.expiry < now) {
            keysToRemove.push(key);
          }
        } catch (e) {
          // 解析できない場合は削除対象に
          keysToRemove.push(key);
        }
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
  } catch (error) {
    console.warn('Failed to cleanup localStorage:', error);
  }
};

/**
 * APIリクエストを実行
 * このメソッドはAmplify SDKまたはFetch APIを抽象化
 * @param options リクエストオプション
 * @returns レスポンスデータ
 */
export const apiRequest = async <T>({
  path,
  method = 'GET',
  body,
  headers = {},
  useAuth = true,
  areaId
}: {
  path: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: any;
  headers?: Record<string, string>;
  useAuth?: boolean;
  areaId?: string;
}): Promise<T> => {
  try {
    // 実際の実装では、AWS AmplifyのAPI.graphqlまたはfetch()を使用
    // ここでは、実装の概要のみ示す
    
    // Amplify v6での実装イメージ
    /*
    const token = useAuth ? (await Auth.currentSession()).getIdToken().getJwtToken() : undefined;
    
    const requestHeaders = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(areaId ? { 'X-Area-Id': areaId } : {}),
      ...headers
    };
    
    const response = await fetch(`/api/${path}`, {
      method,
      headers: requestHeaders,
      body: body ? JSON.stringify(body) : undefined
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw {
        name: 'ApiError',
        message: errorData.message || `API request failed with status ${response.status}`,
        code: errorData.code || String(response.status),
        stack: new Error().stack
      } as ApiError;
    }
    
    return await response.json();
    */
    
    // モック実装（実際にはAmplify APIを使用）
    await new Promise(resolve => setTimeout(resolve, 300));
    return {} as T;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

// ユーティリティ：並行リクエスト制御のためのタスク一時停止
export const waitForCondition = async (
  condition: () => boolean, 
  maxAttempts: number = 10, 
  delayMs: number = 100
): Promise<boolean> => {
  let attempts = 0;
  
  while (!condition() && attempts < maxAttempts) {
    await new Promise(resolve => setTimeout(resolve, delayMs));
    attempts++;
  }
  
  return condition();
};

// 定期的なキャッシュクリーンアップをセットアップ（15分ごと）
if (typeof window !== 'undefined') {
  setInterval(cleanupExpiredCache, 15 * 60 * 1000);
}

export default {
  cacheData,
  getCachedData,
  clearCache,
  clearCacheByPrefix,
  cleanupExpiredCache,
  apiRequest,
  waitForCondition
};