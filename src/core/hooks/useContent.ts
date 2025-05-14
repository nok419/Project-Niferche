// src/core/hooks/useContent.ts
import { useState, useCallback, useRef } from 'react';
import { apiRequest, cacheData, getCachedData } from '../utils/api';
import { 
  ApiError, 
  PaginationOptions, 
  FilterOptions 
} from '../../types/common';

// 並行リクエスト追跡用のマップ型の定義
type FetchingMap = Record<string, boolean>;

// データプリフェッチの優先度
export type FetchPriority = 'high' | 'low';

// モックデータのインポート（実際の実装では削除される）
import { MOCK_CONTENTS } from '../../forclaudecode/mock_data';

// コンテンツの型定義
export interface Content {
  id: string;
  title: string;
  description: string;
  type: string;
  author: string;
  world: string;
  attribute: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  isAvailable: boolean;
}

// コンテンツ取得結果
export interface ContentResult {
  items: Content[];
  nextToken?: string;
}

// コンテンツ取得オプション
export interface ContentOptions extends PaginationOptions {
  filter?: FilterOptions;
  useCache?: boolean;
  cacheDuration?: number;
}

/**
 * コンテンツを取得・管理するためのフック
 * 最適化: バッチ処理、静かなリフレッシュ、プリフェッチ
 */
export const useContent = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  
  // 並行リクエスト追跡用のRefオブジェクト
  // メモ: useRefを使用することで、再レンダリングを引き起こさず値を保持できる
  const isFetchingRef = useRef<FetchingMap>({});
  
  /**
   * コンテンツの静かな更新 (ユーザーには見えないバックグラウンド更新)
   */
  const fetchContentSilently = useCallback(async (
    id: string,
    cacheKey: string,
    cacheDuration: number
  ): Promise<void> => {
    try {
      // モックデータを使用（実際の実装では削除）
      await new Promise(resolve => setTimeout(resolve, 300));
      const content = MOCK_CONTENTS.find(item => item.id === id);
      
      if (content) {
        // キャッシュを更新（UIステートは変更しない）
        cacheData(cacheKey, content, cacheDuration);
      }
    } catch (error) {
      // エラーは無視（静かなリフレッシュなので）
      console.warn('Silent refresh failed:', error);
    }
  }, []);

  /**
   * 単一コンテンツを取得（最適化版）
   * - キャッシュの有効期間を延長 (30分→60分)
   * - 静かなリフレッシュ機能の追加
   * - 並行リクエストの防止
   */
  const getContent = useCallback(async (
    id: string, 
    options?: { useCache?: boolean; cacheDuration?: number; skipRefresh?: boolean }
  ): Promise<Content | null> => {
    const { useCache = true, cacheDuration = 60, skipRefresh = false } = options || {};
    const cacheKey = `content_${id}`;
    
    // 既に同じIDのリクエストが進行中なら、それが完了するまで待機
    if (isFetchingRef.current[cacheKey]) {
      // ポーリングして他のリクエストの完了を待つ
      let attempts = 0;
      while (isFetchingRef.current[cacheKey] && attempts < 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
      }
      
      // 再度キャッシュをチェック
      if (useCache) {
        const cachedContent = getCachedData<Content>(cacheKey);
        if (cachedContent) return cachedContent;
      }
    }
    
    // キャッシュから取得を試みる
    if (useCache) {
      const cachedContent = getCachedData<Content>(cacheKey);
      if (cachedContent) {
        // キャッシュヒット：キャッシュデータを返す
        
        // オンラインかつリフレッシュ不要でない場合、バックグラウンドで更新
        if (!skipRefresh && navigator.onLine && !isFetchingRef.current[cacheKey]) {
          isFetchingRef.current[cacheKey] = true;
          // 非同期でキャッシュ更新（UI操作をブロックしない）
          fetchContentSilently(id, cacheKey, cacheDuration)
            .finally(() => { isFetchingRef.current[cacheKey] = false; });
        }
        
        return cachedContent;
      }
    }
    
    // このリクエストが進行中であることをマーク
    isFetchingRef.current[cacheKey] = true;
    
    setLoading(true);
    setError(null);
    
    try {
      // 実際の実装ではAPIから取得
      // const response = await API.graphql({
      //   query: getContentQuery,
      //   variables: { id }
      // });
      
      // モックデータを使用（実際の実装では削除）
      await new Promise(resolve => setTimeout(resolve, 300));
      const content = MOCK_CONTENTS.find(item => item.id === id);
      
      if (!content) {
        throw new Error('Content not found');
      }
      
      // キャッシュに保存
      if (useCache) {
        cacheData(cacheKey, content, cacheDuration);
      }
      
      return content;
    } catch (e) {
      const apiError = e as ApiError;
      const formattedError = {
        name: apiError.name || 'Error',
        message: apiError.message || 'Failed to get content',
        code: apiError.code,
        stack: apiError.stack
      };
      setError(formattedError);
      return null;
    } finally {
      setLoading(false);
      // このリクエストの完了をマーク
      isFetchingRef.current[cacheKey] = false;
    }
  }, [fetchContentSilently]);

  /**
   * コンテンツ一覧を取得（最適化版）
   * - キャッシュの有効期間を延長 (15分→30分)
   * - 並行リクエストの防止
   * - 静かなリフレッシュの追加
   */
  const listContents = useCallback(async (
    options?: ContentOptions & { skipRefresh?: boolean }
  ): Promise<ContentResult> => {
    const { 
      limit = 10, 
      nextToken, 
      filter, 
      useCache = true, 
      cacheDuration = 30, // キャッシュ期間を延長
      skipRefresh = false
    } = options || {};
    
    // キャッシュキーを生成（フィルターとページネーションを含む）
    const filterString = filter ? JSON.stringify(filter) : '';
    const cacheKey = `contents_list_${filterString}_${limit}_${nextToken || ''}`;
    
    // 既に同じクエリのリクエストが進行中なら待機
    if (isFetchingRef.current[cacheKey]) {
      let attempts = 0;
      while (isFetchingRef.current[cacheKey] && attempts < 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
      }
      
      // 再度キャッシュをチェック
      if (useCache) {
        const cachedResult = getCachedData<ContentResult>(cacheKey);
        if (cachedResult) return cachedResult;
      }
    }
    
    // キャッシュから取得を試みる
    if (useCache) {
      const cachedResult = getCachedData<ContentResult>(cacheKey);
      if (cachedResult) {
        // バックグラウンドで更新（適切な条件下で）
        if (!skipRefresh && navigator.onLine && !isFetchingRef.current[cacheKey]) {
          // 静かにデータを更新
          refreshListSilently(
            { limit, nextToken, filter, useCache: true, cacheDuration },
            cacheKey
          );
        }
        return cachedResult;
      }
    }
    
    // このリクエストが進行中であることをマーク
    isFetchingRef.current[cacheKey] = true;
    
    setLoading(true);
    setError(null);
    
    try {
      // 実際の実装ではAPIから取得
      // const response = await API.graphql({
      //   query: listContentsQuery,
      //   variables: { limit, nextToken, filter }
      // });
      
      // モックデータを使用（実際の実装では削除）
      await new Promise(resolve => setTimeout(resolve, 300));
      
      let filteredContents = [...MOCK_CONTENTS];
      
      // フィルタリングを適用
      if (filter) {
        filteredContents = filteredContents.filter(content => {
          let isMatch = true;
          
          // 各フィルター条件を適用
          for (const [key, value] of Object.entries(filter)) {
            if (value !== undefined && value !== null) {
              // @ts-ignore
              if (content[key] !== value) {
                isMatch = false;
                break;
              }
            }
          }
          
          return isMatch;
        });
      }
      
      // ページネーションを適用
      const startIndex = nextToken ? parseInt(nextToken, 10) : 0;
      const endIndex = startIndex + limit;
      const paginatedContents = filteredContents.slice(startIndex, endIndex);
      
      const result = {
        items: paginatedContents,
        nextToken: endIndex < filteredContents.length ? String(endIndex) : undefined
      };
      
      // キャッシュに保存
      if (useCache) {
        cacheData(cacheKey, result, cacheDuration);
      }
      
      return result;
    } catch (e) {
      const apiError = e as ApiError;
      const formattedError = {
        name: apiError.name || 'Error',
        message: apiError.message || 'Failed to list contents',
        code: apiError.code,
        stack: apiError.stack
      };
      setError(formattedError);
      return { items: [] };
    } finally {
      setLoading(false);
      // このリクエストの完了をマーク
      isFetchingRef.current[cacheKey] = false;
    }
  }, []);
  
  /**
   * コンテンツリストを静かに更新（バックグラウンド更新）
   */
  const refreshListSilently = useCallback(async (
    options: ContentOptions,
    cacheKey: string
  ): Promise<void> => {
    isFetchingRef.current[cacheKey] = true;
    
    try {
      // 実際の実装では非同期でAPIを呼び出す
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const { limit = 10, nextToken, filter, cacheDuration = 30 } = options;
      
      let filteredContents = [...MOCK_CONTENTS];
      
      // フィルタリングを適用
      if (filter) {
        filteredContents = filteredContents.filter(content => {
          let isMatch = true;
          for (const [key, value] of Object.entries(filter)) {
            if (value !== undefined && value !== null) {
              // @ts-ignore
              if (content[key] !== value) {
                isMatch = false;
                break;
              }
            }
          }
          return isMatch;
        });
      }
      
      // ページネーションを適用
      const startIndex = nextToken ? parseInt(nextToken, 10) : 0;
      const endIndex = startIndex + limit;
      const paginatedContents = filteredContents.slice(startIndex, endIndex);
      
      const result = {
        items: paginatedContents,
        nextToken: endIndex < filteredContents.length ? String(endIndex) : undefined
      };
      
      // キャッシュを静かに更新
      cacheData(cacheKey, result, cacheDuration);
    } catch (error) {
      // エラーを無視（UIには表示しない）
      console.warn('Silent list refresh failed:', error);
    } finally {
      isFetchingRef.current[cacheKey] = false;
    }
  }, []);

  /**
   * コンテンツのファイル内容を取得（最適化版）
   * - 並行リクエストの防止
   * - キャッシュの有効期間を調整 (ファイルコンテンツは長期キャッシュ)
   */
  const getFileContent = useCallback(async (
    path: string, 
    options?: { useCache?: boolean; cacheDuration?: number; skipRefresh?: boolean }
  ): Promise<string> => {
    const { useCache = true, cacheDuration = 120, skipRefresh = false } = options || {};
    const cacheKey = `file_content_${path}`;
    
    // 既に同じパスのリクエストが進行中なら待機
    if (isFetchingRef.current[cacheKey]) {
      let attempts = 0;
      while (isFetchingRef.current[cacheKey] && attempts < 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
      }
      
      // 再度キャッシュをチェック
      if (useCache) {
        const cachedContent = getCachedData<string>(cacheKey);
        if (cachedContent) return cachedContent;
      }
    }
    
    // キャッシュから取得を試みる
    if (useCache) {
      const cachedContent = getCachedData<string>(cacheKey);
      if (cachedContent) {
        // 静的コンテンツはあまり変化しないが、オンラインなら稀に更新
        // 10%の確率でバックグラウンド更新
        if (!skipRefresh && navigator.onLine && !isFetchingRef.current[cacheKey] && Math.random() < 0.1) {
          refreshFileSilently(path, cacheKey, cacheDuration);
        }
        return cachedContent;
      }
    }
    
    // このリクエストが進行中であることをマーク
    isFetchingRef.current[cacheKey] = true;
    
    setLoading(true);
    setError(null);
    
    try {
      // 実際の実装ではStorageから取得
      // const content = await Storage.get(path, { download: true });
      
      // モックデータを使用（実際の実装では削除）
      await new Promise(resolve => setTimeout(resolve, 300));
      const content = `# Mock Content for ${path}\n\nThis is a placeholder text for file content.`;
      
      // キャッシュに保存
      if (useCache) {
        cacheData(cacheKey, content, cacheDuration);
      }
      
      return content;
    } catch (e) {
      const apiError = e as ApiError;
      const formattedError = {
        name: apiError.name || 'Error',
        message: apiError.message || 'Failed to get file content',
        code: apiError.code,
        stack: apiError.stack
      };
      setError(formattedError);
      throw formattedError;
    } finally {
      setLoading(false);
      // このリクエストの完了をマーク
      isFetchingRef.current[cacheKey] = false;
    }
  }, []);
  
  /**
   * ファイルコンテンツを静かに更新
   */
  const refreshFileSilently = useCallback(async (
    path: string,
    cacheKey: string,
    cacheDuration: number
  ): Promise<void> => {
    isFetchingRef.current[cacheKey] = true;
    
    try {
      // 実際の実装では非同期でStorageから取得
      await new Promise(resolve => setTimeout(resolve, 300));
      const content = `# Mock Content for ${path}\n\nThis is a placeholder text for file content (updated).`;
      
      // キャッシュを静かに更新
      cacheData(cacheKey, content, cacheDuration);
    } catch (error) {
      // エラーを無視（UIには表示しない）
      console.warn('Silent file refresh failed:', error);
    } finally {
      isFetchingRef.current[cacheKey] = false;
    }
  }, []);

  /**
   * エラーをリセット
   */
  const resetError = useCallback(() => {
    setError(null);
  }, []);
  
  /**
   * バッチ処理でコンテンツを一括取得
   * 複数のコンテンツを効率的に取得するための新機能
   */
  const batchGetContents = useCallback(async (
    ids: string[],
    options?: { useCache?: boolean; cacheDuration?: number }
  ): Promise<Record<string, Content | null>> => {
    const { useCache = true, cacheDuration = 60 } = options || {};
    const results: Record<string, Content | null> = {};
    
    // キャッシュから可能な限り取得
    const idsToFetch = ids.filter(id => {
      if (useCache) {
        const cacheKey = `content_${id}`;
        const cachedContent = getCachedData<Content>(cacheKey);
        if (cachedContent) {
          results[id] = cachedContent;
          return false;
        }
      }
      return true;
    });
    
    // キャッシュに見つからなかったIDのみ取得
    if (idsToFetch.length > 0) {
      const batchCacheKey = `batch_contents_${idsToFetch.sort().join('_')}`;
      
      // 既に進行中のバッチリクエストがあれば待機
      if (isFetchingRef.current[batchCacheKey]) {
        let attempts = 0;
        while (isFetchingRef.current[batchCacheKey] && attempts < 10) {
          await new Promise(resolve => setTimeout(resolve, 100));
          attempts++;
        }
      }
      
      // このバッチリクエストが進行中であることをマーク
      isFetchingRef.current[batchCacheKey] = true;
      
      try {
        // 実際の実装ではバッチAPIを使用
        // const batchResponse = await API.graphql({
        //   query: batchGetContentsQuery,
        //   variables: { ids: idsToFetch }
        // });
        
        // モックデータを使用
        await new Promise(resolve => setTimeout(resolve, 300));
        const batchResults = idsToFetch.map(id => 
          MOCK_CONTENTS.find(item => item.id === id) || null
        );
        
        // 個別のキャッシュと結果オブジェクトに格納
        idsToFetch.forEach((id, index) => {
          const content = batchResults[index];
          results[id] = content;
          
          // 個別のキャッシュにも保存
          if (content && useCache) {
            const cacheKey = `content_${id}`;
            cacheData(cacheKey, content, cacheDuration);
          }
        });
      } catch (e) {
        const apiError = e as ApiError;
        const formattedError = {
          name: apiError.name || 'Error',
          message: apiError.message || 'Failed to batch get contents',
          code: apiError.code,
          stack: apiError.stack
        };
        setError(formattedError);
        
        // エラー時は未取得のIDをnullで埋める
        idsToFetch.forEach(id => {
          if (!(id in results)) {
            results[id] = null;
          }
        });
      } finally {
        // このバッチリクエストの完了をマーク
        isFetchingRef.current[batchCacheKey] = false;
      }
    }
    
    return results;
  }, []);
  
  /**
   * コンテンツをプリフェッチ（先読み）
   * ユーザーが次に必要とする可能性が高いコンテンツを事前に読み込む
   */
  const prefetchContent = useCallback(async (
    ids: string[],
    options?: { priority?: FetchPriority; cacheDuration?: number }
  ): Promise<void> => {
    const { priority = 'low', cacheDuration = 60 } = options || {};
    
    // 優先度が低い場合、ブラウザのアイドル時間を使用
    if (priority === 'low' && 'requestIdleCallback' in window) {
      // @ts-ignore
      window.requestIdleCallback(() => {
        batchGetContents(ids, { cacheDuration });
      });
    } else {
      // 高優先度またはrequestIdleCallbackがサポートされていない場合は即時実行
      batchGetContents(ids, { cacheDuration });
    }
  }, [batchGetContents]);
  
  /**
   * コンテンツリストをプリフェッチ
   */
  const prefetchContentList = useCallback(async (
    options: ContentOptions & { priority?: FetchPriority }
  ): Promise<void> => {
    const { priority = 'low', ...listOptions } = options;
    
    if (priority === 'low' && 'requestIdleCallback' in window) {
      // @ts-ignore
      window.requestIdleCallback(() => {
        listContents({
          ...listOptions,
          skipRefresh: true // 静かなリフレッシュを回避
        });
      });
    } else {
      listContents({
        ...listOptions,
        skipRefresh: true
      });
    }
  }, [listContents]);

  return {
    // 状態
    loading,
    error,
    
    // 基本機能
    getContent,
    listContents,
    getFileContent,
    resetError,
    
    // 最適化機能
    batchGetContents,
    prefetchContent,
    prefetchContentList
  };
};

export default useContent;