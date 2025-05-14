// src/api/hooks/useContent.ts
import { useState, useCallback, useRef, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';
import * as queries from '../../graphql/queries';
import * as mutations from '../../graphql/mutations';
import { ContentCategory, WorldCategory, Visibility, ContentStatus } from '../types';

/**
 * 並行リクエスト追跡用のマップ型
 */
type FetchingMap = Record<string, boolean>;

/**
 * データプリフェッチの優先度
 */
export type FetchPriority = 'high' | 'low';

/**
 * コンテンツ取得オプション
 */
export interface ContentOptions {
  category?: ContentCategory;
  worldType?: WorldCategory;
  status?: ContentStatus;
  visibility?: Visibility;
  limit?: number;
  nextToken?: string;
  useCache?: boolean;
  cacheDuration?: number;
}

/**
 * キャッシュ管理関数
 */
function cacheData<T>(key: string, data: T, expirationMinutes = 30): void {
  const cacheItem = {
    data,
    expiration: Date.now() + expirationMinutes * 60 * 1000
  };
  
  localStorage.setItem(`niferche_cache_${key}`, JSON.stringify(cacheItem));
}

function getCachedData<T>(key: string): T | null {
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

/**
 * GraphQLクライアント
 */
const client = generateClient();

/**
 * Project Niferche 共通コンテンツ管理フック
 */
export function useContent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // 並行リクエスト追跡用のRefオブジェクト
  const isFetchingRef = useRef<FetchingMap>({});
  
  /**
   * コンテンツ取得関数
   */
  const getContent = useCallback(async (
    id: string,
    options?: { useCache?: boolean; cacheDuration?: number; }
  ) => {
    const { useCache = true, cacheDuration = 60 } = options || {};
    const cacheKey = `content_${id}`;
    
    // 既に同じIDのリクエストが進行中なら待機
    if (isFetchingRef.current[cacheKey]) {
      let attempts = 0;
      while (isFetchingRef.current[cacheKey] && attempts < 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
      }
      
      // 再度キャッシュをチェック
      if (useCache) {
        const cachedContent = getCachedData(cacheKey);
        if (cachedContent) return cachedContent;
      }
    }
    
    // キャッシュから取得を試みる
    if (useCache) {
      const cachedContent = getCachedData(cacheKey);
      if (cachedContent) return cachedContent;
    }
    
    // このリクエストが進行中であることをマーク
    isFetchingRef.current[cacheKey] = true;
    setLoading(true);
    setError(null);
    
    try {
      const result = await client.graphql({
        query: queries.getNifercheContent, // 区画Bのコンテンツモデル
        variables: { id }
      });
      
      const content = result.data.getNifercheContent;
      
      // キャッシュに保存
      if (useCache && content) {
        cacheData(cacheKey, content, cacheDuration);
      }
      
      return content;
    } catch (err) {
      console.error('Error fetching content:', err);
      setError(err as Error);
      return null;
    } finally {
      setLoading(false);
      isFetchingRef.current[cacheKey] = false;
    }
  }, []);
  
  /**
   * コンテンツ一覧取得関数
   */
  const listContents = useCallback(async (options?: ContentOptions) => {
    const { 
      category, 
      worldType, 
      status = ContentStatus.PUBLISHED,
      visibility = Visibility.PUBLIC,
      limit = 20, 
      nextToken,
      useCache = true,
      cacheDuration = 30
    } = options || {};
    
    // フィルター作成
    const filter: Record<string, any> = {};
    if (category) filter.category = { eq: category };
    if (worldType) filter.worldType = { eq: worldType };
    if (status) filter.status = { eq: status };
    if (visibility) filter.visibility = { eq: visibility };
    
    // キャッシュキーを生成
    const filterString = JSON.stringify(filter);
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
        const cachedResult = getCachedData(cacheKey);
        if (cachedResult) return cachedResult;
      }
    }
    
    // キャッシュから取得を試みる
    if (useCache) {
      const cachedResult = getCachedData(cacheKey);
      if (cachedResult) return cachedResult;
    }
    
    // このリクエストが進行中であることをマーク
    isFetchingRef.current[cacheKey] = true;
    setLoading(true);
    setError(null);
    
    try {
      const result = await client.graphql({
        query: queries.listNifercheContents,
        variables: { 
          filter,
          limit,
          nextToken
        }
      });
      
      const listResult = result.data.listNifercheContents;
      
      // キャッシュに保存
      if (useCache) {
        cacheData(cacheKey, listResult, cacheDuration);
      }
      
      return listResult;
    } catch (err) {
      console.error('Error listing contents:', err);
      setError(err as Error);
      return { items: [] };
    } finally {
      setLoading(false);
      isFetchingRef.current[cacheKey] = false;
    }
  }, []);
  
  /**
   * コンテンツ作成関数
   */
  const createContent = useCallback(async (input: any) => {
    setLoading(true);
    setError(null);
    
    try {
      // 認証情報を取得
      const user = await getCurrentUser();
      
      const contentInput = {
        ...input,
        authorId: user.userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: 1
      };
      
      const result = await client.graphql({
        query: mutations.createNifercheContent,
        variables: { input: contentInput }
      });
      
      return result.data.createNifercheContent;
    } catch (err) {
      console.error('Error creating content:', err);
      setError(err as Error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  
  /**
   * コンテンツ更新関数
   */
  const updateContent = useCallback(async (input: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const currentContent = await getContent(input.id);
      
      if (!currentContent) {
        throw new Error('Content not found');
      }
      
      const contentInput = {
        ...input,
        updatedAt: new Date().toISOString(),
        version: (currentContent.version || 0) + 1
      };
      
      const result = await client.graphql({
        query: mutations.updateNifercheContent,
        variables: { input: contentInput }
      });
      
      return result.data.updateNifercheContent;
    } catch (err) {
      console.error('Error updating content:', err);
      setError(err as Error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [getContent]);
  
  return {
    loading,
    error,
    getContent,
    listContents,
    createContent,
    updateContent
  };
}

/**
 * Laboratory区画用の創作プロジェクト管理フック
 */
export function useCreativeProject() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // 並行リクエスト追跡用のRefオブジェクト
  const isFetchingRef = useRef<FetchingMap>({});
  
  /**
   * プロジェクト取得関数
   */
  const getProject = useCallback(async (
    id: string,
    options?: { useCache?: boolean; cacheDuration?: number; }
  ) => {
    const { useCache = true, cacheDuration = 60 } = options || {};
    const cacheKey = `lab_project_${id}`;
    
    // キャッシュをチェック
    if (useCache) {
      const cachedProject = getCachedData(cacheKey);
      if (cachedProject) return cachedProject;
    }
    
    // このリクエストが進行中であることをマーク
    isFetchingRef.current[cacheKey] = true;
    setLoading(true);
    setError(null);
    
    try {
      const result = await client.graphql({
        query: queries.getCreativeProject,
        variables: { id }
      });
      
      const project = result.data.getCreativeProject;
      
      // キャッシュに保存
      if (useCache && project) {
        cacheData(cacheKey, project, cacheDuration);
      }
      
      return project;
    } catch (err) {
      console.error('Error fetching project:', err);
      setError(err as Error);
      return null;
    } finally {
      setLoading(false);
      isFetchingRef.current[cacheKey] = false;
    }
  }, []);
  
  /**
   * プロジェクト一覧取得関数
   */
  const listProjects = useCallback(async (options?: {
    visibility?: Visibility;
    limit?: number;
    nextToken?: string;
    useCache?: boolean;
    cacheDuration?: number;
  }) => {
    const { 
      visibility = Visibility.PUBLIC,
      limit = 20, 
      nextToken,
      useCache = true,
      cacheDuration = 30
    } = options || {};
    
    // フィルター作成
    const filter: Record<string, any> = {};
    if (visibility) filter.visibility = { eq: visibility };
    
    // キャッシュキーを生成
    const filterString = JSON.stringify(filter);
    const cacheKey = `lab_projects_list_${filterString}_${limit}_${nextToken || ''}`;
    
    // キャッシュをチェック
    if (useCache) {
      const cachedResult = getCachedData(cacheKey);
      if (cachedResult) return cachedResult;
    }
    
    // このリクエストが進行中であることをマーク
    isFetchingRef.current[cacheKey] = true;
    setLoading(true);
    setError(null);
    
    try {
      const result = await client.graphql({
        query: queries.listCreativeProjects,
        variables: { 
          filter,
          limit,
          nextToken
        }
      });
      
      const listResult = result.data.listCreativeProjects;
      
      // キャッシュに保存
      if (useCache) {
        cacheData(cacheKey, listResult, cacheDuration);
      }
      
      return listResult;
    } catch (err) {
      console.error('Error listing projects:', err);
      setError(err as Error);
      return { items: [] };
    } finally {
      setLoading(false);
      isFetchingRef.current[cacheKey] = false;
    }
  }, []);
  
  /**
   * 自分のプロジェクト一覧取得関数
   */
  const listMyProjects = useCallback(async (options?: {
    limit?: number;
    nextToken?: string;
    useCache?: boolean;
    cacheDuration?: number;
  }) => {
    const { 
      limit = 20, 
      nextToken,
      useCache = true,
      cacheDuration = 30
    } = options || {};
    
    try {
      // 認証情報を取得
      const user = await getCurrentUser();
      
      // フィルター作成
      const filter = {
        ownerId: { eq: user.userId }
      };
      
      // キャッシュキーを生成
      const cacheKey = `lab_my_projects_${limit}_${nextToken || ''}`;
      
      // キャッシュをチェック
      if (useCache) {
        const cachedResult = getCachedData(cacheKey);
        if (cachedResult) return cachedResult;
      }
      
      setLoading(true);
      setError(null);
      
      const result = await client.graphql({
        query: queries.listCreativeProjects,
        variables: { 
          filter,
          limit,
          nextToken
        }
      });
      
      const listResult = result.data.listCreativeProjects;
      
      // キャッシュに保存
      if (useCache) {
        cacheData(cacheKey, listResult, cacheDuration);
      }
      
      return listResult;
    } catch (err) {
      console.error('Error listing my projects:', err);
      setError(err as Error);
      return { items: [] };
    } finally {
      setLoading(false);
    }
  }, []);
  
  /**
   * プロジェクト作成関数
   */
  const createProject = useCallback(async (input: any) => {
    setLoading(true);
    setError(null);
    
    try {
      // 認証情報を取得
      const user = await getCurrentUser();
      
      const projectInput = {
        ...input,
        ownerId: user.userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const result = await client.graphql({
        query: mutations.createCreativeProject,
        variables: { input: projectInput }
      });
      
      return result.data.createCreativeProject;
    } catch (err) {
      console.error('Error creating project:', err);
      setError(err as Error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  
  /**
   * プロジェクト更新関数
   */
  const updateProject = useCallback(async (input: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const projectInput = {
        ...input,
        updatedAt: new Date().toISOString()
      };
      
      const result = await client.graphql({
        query: mutations.updateCreativeProject,
        variables: { input: projectInput }
      });
      
      return result.data.updateCreativeProject;
    } catch (err) {
      console.error('Error updating project:', err);
      setError(err as Error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  
  /**
   * タスク作成関数
   */
  const createTask = useCallback(async (input: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const taskInput = {
        ...input,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const result = await client.graphql({
        query: mutations.createCreativeTask,
        variables: { input: taskInput }
      });
      
      return result.data.createCreativeTask;
    } catch (err) {
      console.error('Error creating task:', err);
      setError(err as Error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  
  /**
   * タスク更新関数
   */
  const updateTask = useCallback(async (input: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const taskInput = {
        ...input,
        updatedAt: new Date().toISOString()
      };
      
      // 完了ステータスの場合は完了日時を追加
      if (input.status === 'COMPLETED' && !input.completedAt) {
        taskInput.completedAt = new Date().toISOString();
      }
      
      const result = await client.graphql({
        query: mutations.updateCreativeTask,
        variables: { input: taskInput }
      });
      
      return result.data.updateCreativeTask;
    } catch (err) {
      console.error('Error updating task:', err);
      setError(err as Error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  
  return {
    loading,
    error,
    getProject,
    listProjects,
    listMyProjects,
    createProject,
    updateProject,
    createTask,
    updateTask
  };
}

/**
 * 区画A: サイト管理用のお知らせ管理フック
 */
export function useAnnouncement() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  /**
   * お知らせ一覧取得関数
   */
  const listAnnouncements = useCallback(async (options?: {
    limit?: number;
    nextToken?: string;
  }) => {
    const { limit = 20, nextToken } = options || {};
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await client.graphql({
        query: queries.listAnnouncements,
        variables: { limit, nextToken }
      });
      
      return result.data.listAnnouncements;
    } catch (err) {
      console.error('Error listing announcements:', err);
      setError(err as Error);
      return { items: [] };
    } finally {
      setLoading(false);
    }
  }, []);
  
  /**
   * お知らせ作成関数
   */
  const createAnnouncement = useCallback(async (input: any) => {
    setLoading(true);
    setError(null);
    
    try {
      // 認証情報を取得
      const user = await getCurrentUser();
      
      const announcementInput = {
        ...input,
        authorId: user.userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const result = await client.graphql({
        query: mutations.createAnnouncement,
        variables: { input: announcementInput }
      });
      
      return result.data.createAnnouncement;
    } catch (err) {
      console.error('Error creating announcement:', err);
      setError(err as Error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  
  /**
   * お知らせ更新関数
   */
  const updateAnnouncement = useCallback(async (input: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const announcementInput = {
        ...input,
        updatedAt: new Date().toISOString()
      };
      
      const result = await client.graphql({
        query: mutations.updateAnnouncement,
        variables: { input: announcementInput }
      });
      
      return result.data.updateAnnouncement;
    } catch (err) {
      console.error('Error updating announcement:', err);
      setError(err as Error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  
  return {
    loading,
    error,
    listAnnouncements,
    createAnnouncement,
    updateAnnouncement
  };
}

/**
 * プロフィール管理フック
 */
export function useProfile() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  
  // 現在のユーザー情報を取得
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const user = await getCurrentUser();
        
        const result = await client.graphql({
          query: queries.getUserProfile,
          variables: { id: user.userId }
        });
        
        const profile = result.data.getUserProfile;
        if (profile) {
          setUserProfile(profile);
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
      }
    };
    
    fetchUserProfile();
  }, []);
  
  /**
   * プロフィール取得関数
   */
  const getProfile = useCallback(async (userId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await client.graphql({
        query: queries.getUserProfile,
        variables: { id: userId }
      });
      
      return result.data.getUserProfile;
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err as Error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  
  /**
   * プロフィール更新関数
   */
  const updateProfile = useCallback(async (input: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const profileInput = {
        ...input,
        updatedAt: new Date().toISOString()
      };
      
      const result = await client.graphql({
        query: mutations.updateUserProfile,
        variables: { input: profileInput }
      });
      
      const updatedProfile = result.data.updateUserProfile;
      setUserProfile(updatedProfile);
      
      return updatedProfile;
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err as Error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  
  return {
    loading,
    error,
    userProfile,
    getProfile,
    updateProfile
  };
}

// 型定義エクスポート用
export type { ContentCategory, WorldCategory, Visibility, ContentStatus };