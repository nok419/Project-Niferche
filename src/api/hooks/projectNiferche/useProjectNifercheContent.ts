// File: src/api/hooks/projectNiferche/useProjectNifercheContent.ts
import { useState, useCallback, useRef } from 'react';
import { 
  apiRequest, 
  cacheData, 
  getCachedData, 
  clearCache, 
  waitForCondition 
} from '../../utils/api';
import { 
  ApiError, 
  PaginationOptions, 
  FilterOptions, 
  ContentResult,
  ContentReference,
  Collaborator,
  BaseEntity,
  StorageReference,
  PNContentCategory,
  WorldCategory,
  Attribution,
  Visibility,
  ContentStatus,
  CreateResult,
  UpdateResult,
  DeleteResult,
  AreaId
} from '../../../types/common';

// 並行リクエスト追跡用のマップ型
type FetchingMap = Record<string, boolean>;

// Project Nifercheコンテンツ型
export interface ProjectNifercheContent extends BaseEntity {
  title: string;
  description: string;
  
  // コンテンツ分類情報
  primaryCategory: PNContentCategory;
  secondaryCategories?: string[];
  worldType: WorldCategory;
  attribution: Attribution;
  visibility: Visibility;
  targetGroups?: string[];
  
  // ステータス
  status: ContentStatus;
  publishDate?: string;
  
  // メタデータ
  tags?: string[];
  sourceRefs?: ContentReference[];
  characterRefs?: string[];
  relatedContent?: ContentReference[];
  version: string;
  
  // ストレージ情報
  mainFile: StorageReference;
  thumbnail?: StorageReference;
  attachments?: StorageReference[];
  
  // アクセス制御
  ownerId: string;
  collaborators?: Collaborator[];
}

// クエリオプション
export interface PNContentQueryOptions extends PaginationOptions {
  filter?: FilterOptions;
  useCache?: boolean;
  cacheDuration?: number;
}

// 作成入力
export interface CreatePNContentInput extends Omit<ProjectNifercheContent, 'id' | 'createdAt' | 'updatedAt'> {}

// 更新入力
export interface UpdatePNContentInput extends Partial<Omit<ProjectNifercheContent, 'id' | 'createdAt' | 'updatedAt'>> {
  id: string;
}

/**
 * Project Niferche区画のコンテンツを取得・管理するためのフック
 */
export const useProjectNifercheContent = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  
  // 並行リクエスト追跡用のRefオブジェクト
  const isFetchingRef = useRef<FetchingMap>({});
  
  /**
   * 単一コンテンツを取得
   */
  const getContent = useCallback(async (
    id: string, 
    options?: { useCache?: boolean; cacheDuration?: number; skipRefresh?: boolean }
  ): Promise<ProjectNifercheContent | null> => {
    const { useCache = true, cacheDuration = 60, skipRefresh = false } = options || {};
    const cacheKey = `pn_content_${id}`;
    
    // 既に同じIDのリクエストが進行中なら、それが完了するまで待機
    if (isFetchingRef.current[cacheKey]) {
      await waitForCondition(() => !isFetchingRef.current[cacheKey]);
      
      // 再度キャッシュをチェック
      if (useCache) {
        const cachedContent = getCachedData<ProjectNifercheContent>(cacheKey);
        if (cachedContent) return cachedContent;
      }
    }
    
    // キャッシュから取得を試みる
    if (useCache) {
      const cachedContent = getCachedData<ProjectNifercheContent>(cacheKey);
      if (cachedContent) {
        // キャッシュヒット：キャッシュデータを返す
        
        // オンラインかつリフレッシュ不要でない場合、バックグラウンドで更新
        if (!skipRefresh && navigator.onLine && !isFetchingRef.current[cacheKey]) {
          // 非同期でキャッシュ更新（UI操作をブロックしない）
          refreshContentSilently(id, cacheKey, cacheDuration);
        }
        
        return cachedContent;
      }
    }
    
    // このリクエストが進行中であることをマーク
    isFetchingRef.current[cacheKey] = true;
    
    setLoading(true);
    setError(null);
    
    try {
      // リクエスト実行
      const response = await apiRequest<{ getProjectNifercheContent: ProjectNifercheContent }>({
        path: `projectNiferche/content/${id}`,
        method: 'GET',
        useAuth: true,
        areaId: AreaId.PROJECT_NIFERCHE
      });
      
      const content = response.getProjectNifercheContent;
      
      // キャッシュに保存
      if (useCache && content) {
        cacheData(cacheKey, content, cacheDuration);
      }
      
      return content;
    } catch (e) {
      const apiError = e as ApiError;
      setError(apiError);
      return null;
    } finally {
      setLoading(false);
      // このリクエストの完了をマーク
      isFetchingRef.current[cacheKey] = false;
    }
  }, []);

  /**
   * コンテンツを静かに更新（バックグラウンド更新）
   */
  const refreshContentSilently = useCallback(async (
    id: string,
    cacheKey: string,
    cacheDuration: number = 60
  ): Promise<void> => {
    // 既に更新中ならスキップ
    if (isFetchingRef.current[cacheKey]) return;
    
    isFetchingRef.current[cacheKey] = true;
    
    try {
      // リクエスト実行
      const response = await apiRequest<{ getProjectNifercheContent: ProjectNifercheContent }>({
        path: `projectNiferche/content/${id}`,
        method: 'GET',
        useAuth: true,
        areaId: AreaId.PROJECT_NIFERCHE
      });
      
      const content = response.getProjectNifercheContent;
      
      // キャッシュを更新
      if (content) {
        cacheData(cacheKey, content, cacheDuration);
      }
    } catch (error) {
      // エラーは無視（静かなリフレッシュなので）
      console.warn('Silent refresh failed:', error);
    } finally {
      isFetchingRef.current[cacheKey] = false;
    }
  }, []);

  /**
   * コンテンツ一覧を取得
   */
  const listContents = useCallback(async (
    options?: PNContentQueryOptions & { skipRefresh?: boolean }
  ): Promise<ContentResult<ProjectNifercheContent>> => {
    const { 
      limit = 10, 
      nextToken, 
      filter, 
      useCache = true, 
      cacheDuration = 30,
      skipRefresh = false
    } = options || {};
    
    // キャッシュキーを生成
    const filterString = filter ? JSON.stringify(filter) : '';
    const cacheKey = `pn_contents_list_${filterString}_${limit}_${nextToken || ''}`;
    
    // 既に同じクエリのリクエストが進行中なら待機
    if (isFetchingRef.current[cacheKey]) {
      await waitForCondition(() => !isFetchingRef.current[cacheKey]);
      
      // 再度キャッシュをチェック
      if (useCache) {
        const cachedResult = getCachedData<ContentResult<ProjectNifercheContent>>(cacheKey);
        if (cachedResult) return cachedResult;
      }
    }
    
    // キャッシュから取得を試みる
    if (useCache) {
      const cachedResult = getCachedData<ContentResult<ProjectNifercheContent>>(cacheKey);
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
      // リクエスト実行
      const response = await apiRequest<{ 
        listProjectNifercheContents: {
          items: ProjectNifercheContent[];
          nextToken?: string;
        } 
      }>({
        path: 'projectNiferche/contents',
        method: 'GET',
        useAuth: true,
        areaId: AreaId.PROJECT_NIFERCHE
      });
      
      const result: ContentResult<ProjectNifercheContent> = {
        items: response.listProjectNifercheContents.items,
        nextToken: response.listProjectNifercheContents.nextToken
      };
      
      // キャッシュに保存
      if (useCache) {
        cacheData(cacheKey, result, cacheDuration);
      }
      
      return result;
    } catch (e) {
      const apiError = e as ApiError;
      setError(apiError);
      return { items: [] };
    } finally {
      setLoading(false);
      // このリクエストの完了をマーク
      isFetchingRef.current[cacheKey] = false;
    }
  }, []);
  
  /**
   * コンテンツリストを静かに更新
   */
  const refreshListSilently = useCallback(async (
    options: PNContentQueryOptions,
    cacheKey: string
  ): Promise<void> => {
    // 既に更新中ならスキップ
    if (isFetchingRef.current[cacheKey]) return;
    
    isFetchingRef.current[cacheKey] = true;
    
    try {
      const { limit = 10, nextToken, filter, cacheDuration = 30 } = options;
      
      // リクエスト実行
      const response = await apiRequest<{ 
        listProjectNifercheContents: {
          items: ProjectNifercheContent[];
          nextToken?: string;
        } 
      }>({
        path: 'projectNiferche/contents',
        method: 'GET',
        useAuth: true,
        areaId: AreaId.PROJECT_NIFERCHE
      });
      
      const result: ContentResult<ProjectNifercheContent> = {
        items: response.listProjectNifercheContents.items,
        nextToken: response.listProjectNifercheContents.nextToken
      };
      
      // キャッシュを静かに更新
      cacheData(cacheKey, result, cacheDuration);
    } catch (error) {
      // エラーは無視（UIには表示しない）
      console.warn('Silent list refresh failed:', error);
    } finally {
      isFetchingRef.current[cacheKey] = false;
    }
  }, []);

  /**
   * 新しいコンテンツを作成
   */
  const createContent = useCallback(async (
    input: CreatePNContentInput
  ): Promise<CreateResult<ProjectNifercheContent>> => {
    setLoading(true);
    setError(null);
    
    try {
      // リクエスト実行
      const response = await apiRequest<{ 
        createProjectNifercheContent: ProjectNifercheContent 
      }>({
        path: 'projectNiferche/content',
        method: 'POST',
        body: { input },
        useAuth: true,
        areaId: AreaId.PROJECT_NIFERCHE
      });
      
      const newContent = response.createProjectNifercheContent;
      
      // コンテンツ作成後にキャッシュをクリア（一覧の再取得が必要）
      clearCache(`pn_contents_list_`);
      
      return {
        success: true,
        item: newContent
      };
    } catch (e) {
      const apiError = e as ApiError;
      setError(apiError);
      return {
        success: false,
        error: apiError
      };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * コンテンツを更新
   */
  const updateContent = useCallback(async (
    input: UpdatePNContentInput
  ): Promise<UpdateResult<ProjectNifercheContent>> => {
    setLoading(true);
    setError(null);
    
    try {
      // リクエスト実行
      const response = await apiRequest<{ 
        updateProjectNifercheContent: ProjectNifercheContent 
      }>({
        path: `projectNiferche/content/${input.id}`,
        method: 'PUT',
        body: { input },
        useAuth: true,
        areaId: AreaId.PROJECT_NIFERCHE
      });
      
      const updatedContent = response.updateProjectNifercheContent;
      
      // 更新したコンテンツのキャッシュを削除
      clearCache(`pn_content_${input.id}`);
      // リストキャッシュもクリア
      clearCache(`pn_contents_list_`);
      
      return {
        success: true,
        item: updatedContent
      };
    } catch (e) {
      const apiError = e as ApiError;
      setError(apiError);
      return {
        success: false,
        error: apiError
      };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * コンテンツを削除
   */
  const deleteContent = useCallback(async (
    id: string
  ): Promise<DeleteResult> => {
    setLoading(true);
    setError(null);
    
    try {
      // リクエスト実行
      await apiRequest<{ deleteProjectNifercheContent: { id: string } }>({
        path: `projectNiferche/content/${id}`,
        method: 'DELETE',
        useAuth: true,
        areaId: AreaId.PROJECT_NIFERCHE
      });
      
      // 削除したコンテンツのキャッシュを削除
      clearCache(`pn_content_${id}`);
      // リストキャッシュもクリア
      clearCache(`pn_contents_list_`);
      
      return {
        success: true,
        id
      };
    } catch (e) {
      const apiError = e as ApiError;
      setError(apiError);
      return {
        success: false,
        error: apiError
      };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * エラーをリセット
   */
  const resetError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // 状態
    loading,
    error,
    
    // 基本CRUD操作
    getContent,
    listContents,
    createContent,
    updateContent,
    deleteContent,
    resetError
  };
};

export default useProjectNifercheContent;