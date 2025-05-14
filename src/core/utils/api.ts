// src/core/utils/api.ts
import { ApiError, ApiResponse } from '../../types/common';

/**
 * API呼び出しを処理するラッパー関数
 * エラーハンドリングとレスポンス正規化を提供
 */
export async function apiRequest<T>(
  fetcher: () => Promise<T>, 
  errorMessage = 'APIリクエストに失敗しました'
): Promise<ApiResponse<T>> {
  try {
    const data = await fetcher();
    return { data };
  } catch (error) {
    console.error('API Error:', error);
    
    // エラーオブジェクトの型変換と正規化
    const apiError: ApiError = {
      name: error instanceof Error ? error.name : 'Unknown Error',
      message: error instanceof Error ? error.message : errorMessage,
      code: error instanceof Error && 'code' in error ? (error as any).code : undefined,
      statusCode: error instanceof Error && 'statusCode' in error ? (error as any).statusCode : undefined,
      stack: error instanceof Error ? error.stack : undefined
    };
    
    return {
      data: null,
      errors: [apiError]
    };
  }
}

/**
 * 指定時間後に解決するPromiseを返す
 * モックデータや遅延シミュレーション用
 */
export function delay<T>(ms: number, value?: T): Promise<T | undefined> {
  return new Promise(resolve => setTimeout(() => resolve(value), ms));
}

/**
 * 成功確率50%のランダム成功/失敗を返すモック関数
 * テスト用
 */
export async function randomSuccess<T>(
  successValue: T, 
  errorMessage = 'ランダムエラー', 
  successProbability = 0.5
): Promise<T> {
  await delay(500); // 0.5秒の遅延
  
  if (Math.random() < successProbability) {
    return successValue;
  }
  
  throw new Error(errorMessage);
}

/**
 * URLパラメータをオブジェクトから構築
 */
export function buildQueryParams(params: Record<string, string | number | boolean | undefined>): string {
  const validParams = Object.entries(params)
    .filter(([_, value]) => value !== undefined)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
  
  return validParams.length ? `?${validParams.join('&')}` : '';
}

/**
 * データをローカルストレージにキャッシュ
 */
export function cacheData<T>(key: string, data: T, expirationMinutes = 60): void {
  const cacheItem = {
    data,
    expiration: Date.now() + expirationMinutes * 60 * 1000
  };
  
  localStorage.setItem(`niferche_cache_${key}`, JSON.stringify(cacheItem));
}

/**
 * ローカルストレージからキャッシュデータを取得
 */
export function getCachedData<T>(key: string): T | null {
  try {
    const cachedItem = localStorage.getItem(`niferche_cache_${key}`);
    if (!cachedItem) return null;
    
    const { data, expiration } = JSON.parse(cachedItem);
    
    // キャッシュが期限切れの場合
    if (Date.now() > expiration) {
      localStorage.removeItem(`niferche_cache_${key}`);
      return null;
    }
    
    return data as T;
  } catch (error) {
    console.error('Cache error:', error);
    return null;
  }
}