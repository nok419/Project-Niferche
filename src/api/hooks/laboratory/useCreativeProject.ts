// File: src/api/hooks/laboratory/useCreativeProject.ts
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
  BaseEntity,
  StorageReference,
  Collaborator,
  LabContentCategory,
  Visibility,
  CreativeLifecycleStatus,
  CreateResult,
  UpdateResult,
  DeleteResult,
  AreaId
} from '../../../types/common';

// 並行リクエスト追跡用のマップ型
type FetchingMap = Record<string, boolean>;

/**
 * Laboratoryの創作プロジェクト型
 */
export interface CreativeProject extends BaseEntity {
  title: string;
  description: string;
  
  // プロジェクト情報
  projectType: string;
  category: LabContentCategory;
  visibility: Visibility;
  targetGroups?: string[];
  
  // ライフサイクル管理 (LCB特有)
  lifecycleStatus: CreativeLifecycleStatus;
  currentPhase: string;
  phaseStartDate: string;
  targetCompletionDate?: string;
  progress: number; // 0-100の進捗率
  
  // メタデータ
  tags?: string[];
  relatedProjects?: string[];
  worldReference?: string; // Project Nifercheの世界設定への参照
  
  // リソース
  resources?: StorageReference[];
  thumbnail?: StorageReference;
  
  // アクセス制御
  ownerId: string;
  collaborators?: Collaborator[];
}

/**
 * アーティファクト型 (プロジェクトの成果物)
 */
export interface CreativeArtifact extends BaseEntity {
  projectId: string;
  title: string;
  description: string;
  type: string; // IMAGE, DOCUMENT, AUDIO, VIDEO, etc.
  status: string; // DRAFT, REVIEW, APPROVED, PUBLISHED, ARCHIVED
  version: string;
  file: StorageReference;
  thumbnail?: StorageReference;
  tags?: string[];
  createdBy: string;
  visibility: Visibility;
}

/**
 * タスク型
 */
export interface CreativeTask extends BaseEntity {
  projectId: string;
  title: string;
  description: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'BLOCKED' | 'COMPLETED' | 'CANCELLED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  assigneeId?: string;
  dueDate?: string;
  startDate?: string;
  completedDate?: string;
  tags?: string[];
  attachments?: StorageReference[];
  parentTaskId?: string;
  milestoneId?: string;
}

/**
 * マイルストーン型
 */
export interface Milestone extends BaseEntity {
  projectId: string;
  title: string;
  description: string;
  dueDate: string;
  completedDate?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'MISSED';
}

// クエリオプション
export interface ProjectQueryOptions extends PaginationOptions {
  filter?: FilterOptions;
  useCache?: boolean;
  cacheDuration?: number;
}

// 作成入力
export interface CreateProjectInput extends Omit<CreativeProject, 'id' | 'createdAt' | 'updatedAt'> {}

// 更新入力
export interface UpdateProjectInput extends Partial<Omit<CreativeProject, 'id' | 'createdAt' | 'updatedAt'>> {
  id: string;
}

// アーティファクト作成入力
export interface CreateArtifactInput extends Omit<CreativeArtifact, 'id' | 'createdAt' | 'updatedAt'> {}

// タスク作成入力
export interface CreateTaskInput extends Omit<CreativeTask, 'id' | 'createdAt' | 'updatedAt'> {}

/**
 * Laboratory区画の創作プロジェクト管理用フック
 */
export const useCreativeProject = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  
  // 並行リクエスト追跡用のRefオブジェクト
  const isFetchingRef = useRef<FetchingMap>({});
  
  /**
   * 単一プロジェクトを取得
   */
  const getProject = useCallback(async (
    id: string, 
    options?: { useCache?: boolean; cacheDuration?: number; skipRefresh?: boolean }
  ): Promise<CreativeProject | null> => {
    const { useCache = true, cacheDuration = 60, skipRefresh = false } = options || {};
    const cacheKey = `lab_project_${id}`;
    
    // 既に同じIDのリクエストが進行中なら、それが完了するまで待機
    if (isFetchingRef.current[cacheKey]) {
      await waitForCondition(() => !isFetchingRef.current[cacheKey]);
      
      // 再度キャッシュをチェック
      if (useCache) {
        const cachedProject = getCachedData<CreativeProject>(cacheKey);
        if (cachedProject) return cachedProject;
      }
    }
    
    // キャッシュから取得を試みる
    if (useCache) {
      const cachedProject = getCachedData<CreativeProject>(cacheKey);
      if (cachedProject) {
        // キャッシュヒット：キャッシュデータを返す
        
        // オンラインかつリフレッシュ不要でない場合、バックグラウンドで更新
        if (!skipRefresh && navigator.onLine && !isFetchingRef.current[cacheKey]) {
          // 非同期でキャッシュ更新（UI操作をブロックしない）
          refreshProjectSilently(id, cacheKey, cacheDuration);
        }
        
        return cachedProject;
      }
    }
    
    // このリクエストが進行中であることをマーク
    isFetchingRef.current[cacheKey] = true;
    
    setLoading(true);
    setError(null);
    
    try {
      // リクエスト実行
      const response = await apiRequest<{ getCreativeProject: CreativeProject }>({
        path: `laboratory/project/${id}`,
        method: 'GET',
        useAuth: true,
        areaId: AreaId.LABORATORY
      });
      
      const project = response.getCreativeProject;
      
      // キャッシュに保存
      if (useCache && project) {
        cacheData(cacheKey, project, cacheDuration);
      }
      
      return project;
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
   * プロジェクトを静かに更新（バックグラウンド更新）
   */
  const refreshProjectSilently = useCallback(async (
    id: string,
    cacheKey: string,
    cacheDuration: number = 60
  ): Promise<void> => {
    // 既に更新中ならスキップ
    if (isFetchingRef.current[cacheKey]) return;
    
    isFetchingRef.current[cacheKey] = true;
    
    try {
      // リクエスト実行
      const response = await apiRequest<{ getCreativeProject: CreativeProject }>({
        path: `laboratory/project/${id}`,
        method: 'GET',
        useAuth: true,
        areaId: AreaId.LABORATORY
      });
      
      const project = response.getCreativeProject;
      
      // キャッシュを更新
      if (project) {
        cacheData(cacheKey, project, cacheDuration);
      }
    } catch (error) {
      // エラーは無視（静かなリフレッシュなので）
      console.warn('Silent project refresh failed:', error);
    } finally {
      isFetchingRef.current[cacheKey] = false;
    }
  }, []);

  /**
   * プロジェクト一覧を取得
   */
  const listProjects = useCallback(async (
    options?: ProjectQueryOptions & { skipRefresh?: boolean }
  ): Promise<ContentResult<CreativeProject>> => {
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
    const cacheKey = `lab_projects_list_${filterString}_${limit}_${nextToken || ''}`;
    
    // 既に同じクエリのリクエストが進行中なら待機
    if (isFetchingRef.current[cacheKey]) {
      await waitForCondition(() => !isFetchingRef.current[cacheKey]);
      
      // 再度キャッシュをチェック
      if (useCache) {
        const cachedResult = getCachedData<ContentResult<CreativeProject>>(cacheKey);
        if (cachedResult) return cachedResult;
      }
    }
    
    // キャッシュから取得を試みる
    if (useCache) {
      const cachedResult = getCachedData<ContentResult<CreativeProject>>(cacheKey);
      if (cachedResult) {
        // バックグラウンドで更新（適切な条件下で）
        if (!skipRefresh && navigator.onLine && !isFetchingRef.current[cacheKey]) {
          // 静かにデータを更新
          refreshProjectsListSilently(
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
        listCreativeProjects: {
          items: CreativeProject[];
          nextToken?: string;
        } 
      }>({
        path: 'laboratory/projects',
        method: 'GET',
        useAuth: true,
        areaId: AreaId.LABORATORY
      });
      
      const result: ContentResult<CreativeProject> = {
        items: response.listCreativeProjects.items,
        nextToken: response.listCreativeProjects.nextToken
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
   * プロジェクトリストを静かに更新
   */
  const refreshProjectsListSilently = useCallback(async (
    options: ProjectQueryOptions,
    cacheKey: string
  ): Promise<void> => {
    // 既に更新中ならスキップ
    if (isFetchingRef.current[cacheKey]) return;
    
    isFetchingRef.current[cacheKey] = true;
    
    try {
      const { limit = 10, nextToken, filter, cacheDuration = 30 } = options;
      
      // リクエスト実行
      const response = await apiRequest<{ 
        listCreativeProjects: {
          items: CreativeProject[];
          nextToken?: string;
        } 
      }>({
        path: 'laboratory/projects',
        method: 'GET',
        useAuth: true,
        areaId: AreaId.LABORATORY
      });
      
      const result: ContentResult<CreativeProject> = {
        items: response.listCreativeProjects.items,
        nextToken: response.listCreativeProjects.nextToken
      };
      
      // キャッシュを静かに更新
      cacheData(cacheKey, result, cacheDuration);
    } catch (error) {
      // エラーは無視（UIには表示しない）
      console.warn('Silent projects list refresh failed:', error);
    } finally {
      isFetchingRef.current[cacheKey] = false;
    }
  }, []);

  /**
   * 新しいプロジェクトを作成
   */
  const createProject = useCallback(async (
    input: CreateProjectInput
  ): Promise<CreateResult<CreativeProject>> => {
    setLoading(true);
    setError(null);
    
    try {
      // リクエスト実行
      const response = await apiRequest<{ 
        createCreativeProject: CreativeProject 
      }>({
        path: 'laboratory/project',
        method: 'POST',
        body: { input },
        useAuth: true,
        areaId: AreaId.LABORATORY
      });
      
      const newProject = response.createCreativeProject;
      
      // プロジェクト作成後にキャッシュをクリア（一覧の再取得が必要）
      clearCache(`lab_projects_list_`);
      
      return {
        success: true,
        item: newProject
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
   * プロジェクトを更新
   */
  const updateProject = useCallback(async (
    input: UpdateProjectInput
  ): Promise<UpdateResult<CreativeProject>> => {
    setLoading(true);
    setError(null);
    
    try {
      // リクエスト実行
      const response = await apiRequest<{ 
        updateCreativeProject: CreativeProject 
      }>({
        path: `laboratory/project/${input.id}`,
        method: 'PUT',
        body: { input },
        useAuth: true,
        areaId: AreaId.LABORATORY
      });
      
      const updatedProject = response.updateCreativeProject;
      
      // 更新したプロジェクトのキャッシュを削除
      clearCache(`lab_project_${input.id}`);
      // リストキャッシュもクリア
      clearCache(`lab_projects_list_`);
      
      return {
        success: true,
        item: updatedProject
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
   * プロジェクトを削除
   */
  const deleteProject = useCallback(async (
    id: string
  ): Promise<DeleteResult> => {
    setLoading(true);
    setError(null);
    
    try {
      // リクエスト実行
      await apiRequest<{ deleteCreativeProject: { id: string } }>({
        path: `laboratory/project/${id}`,
        method: 'DELETE',
        useAuth: true,
        areaId: AreaId.LABORATORY
      });
      
      // 削除したプロジェクトのキャッシュを削除
      clearCache(`lab_project_${id}`);
      // リストキャッシュもクリア
      clearCache(`lab_projects_list_`);
      
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
   * プロジェクトのアーティファクト一覧を取得
   */
  const listProjectArtifacts = useCallback(async (
    projectId: string,
    options?: PaginationOptions & { useCache?: boolean; cacheDuration?: number }
  ): Promise<ContentResult<CreativeArtifact>> => {
    const { 
      limit = 20, 
      nextToken, 
      useCache = true, 
      cacheDuration = 30 
    } = options || {};
    
    const cacheKey = `lab_project_${projectId}_artifacts_${limit}_${nextToken || ''}`;
    
    // キャッシュをチェック
    if (useCache) {
      const cachedResult = getCachedData<ContentResult<CreativeArtifact>>(cacheKey);
      if (cachedResult) return cachedResult;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // リクエスト実行
      const response = await apiRequest<{ 
        listCreativeArtifacts: {
          items: CreativeArtifact[];
          nextToken?: string;
        } 
      }>({
        path: `laboratory/project/${projectId}/artifacts`,
        method: 'GET',
        useAuth: true,
        areaId: AreaId.LABORATORY
      });
      
      const result: ContentResult<CreativeArtifact> = {
        items: response.listCreativeArtifacts.items,
        nextToken: response.listCreativeArtifacts.nextToken
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
    }
  }, []);

  /**
   * プロジェクトにアーティファクトを追加
   */
  const createArtifact = useCallback(async (
    input: CreateArtifactInput
  ): Promise<CreateResult<CreativeArtifact>> => {
    setLoading(true);
    setError(null);
    
    try {
      // リクエスト実行
      const response = await apiRequest<{ 
        createCreativeArtifact: CreativeArtifact 
      }>({
        path: 'laboratory/artifact',
        method: 'POST',
        body: { input },
        useAuth: true,
        areaId: AreaId.LABORATORY
      });
      
      const newArtifact = response.createCreativeArtifact;
      
      // アーティファクト一覧キャッシュをクリア
      clearCache(`lab_project_${input.projectId}_artifacts_`);
      
      return {
        success: true,
        item: newArtifact
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
   * プロジェクトのタスク一覧を取得
   */
  const listProjectTasks = useCallback(async (
    projectId: string,
    options?: PaginationOptions & { useCache?: boolean; cacheDuration?: number }
  ): Promise<ContentResult<CreativeTask>> => {
    const { 
      limit = 50, 
      nextToken, 
      useCache = true, 
      cacheDuration = 30 
    } = options || {};
    
    const cacheKey = `lab_project_${projectId}_tasks_${limit}_${nextToken || ''}`;
    
    // キャッシュをチェック
    if (useCache) {
      const cachedResult = getCachedData<ContentResult<CreativeTask>>(cacheKey);
      if (cachedResult) return cachedResult;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // リクエスト実行
      const response = await apiRequest<{ 
        listCreativeTasks: {
          items: CreativeTask[];
          nextToken?: string;
        } 
      }>({
        path: `laboratory/project/${projectId}/tasks`,
        method: 'GET',
        useAuth: true,
        areaId: AreaId.LABORATORY
      });
      
      const result: ContentResult<CreativeTask> = {
        items: response.listCreativeTasks.items,
        nextToken: response.listCreativeTasks.nextToken
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
    }
  }, []);

  /**
   * プロジェクトにタスクを追加
   */
  const createTask = useCallback(async (
    input: CreateTaskInput
  ): Promise<CreateResult<CreativeTask>> => {
    setLoading(true);
    setError(null);
    
    try {
      // リクエスト実行
      const response = await apiRequest<{ 
        createCreativeTask: CreativeTask 
      }>({
        path: 'laboratory/task',
        method: 'POST',
        body: { input },
        useAuth: true,
        areaId: AreaId.LABORATORY
      });
      
      const newTask = response.createCreativeTask;
      
      // タスク一覧キャッシュをクリア
      clearCache(`lab_project_${input.projectId}_tasks_`);
      
      return {
        success: true,
        item: newTask
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
   * タスクを更新（ステータス変更など）
   */
  const updateTask = useCallback(async (
    taskId: string,
    input: Partial<Omit<CreativeTask, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<UpdateResult<CreativeTask>> => {
    setLoading(true);
    setError(null);
    
    try {
      // リクエスト実行
      const response = await apiRequest<{ 
        updateCreativeTask: CreativeTask 
      }>({
        path: `laboratory/task/${taskId}`,
        method: 'PUT',
        body: { input },
        useAuth: true,
        areaId: AreaId.LABORATORY
      });
      
      const updatedTask = response.updateCreativeTask;
      
      // タスク一覧キャッシュをクリア
      clearCache(`lab_project_${updatedTask.projectId}_tasks_`);
      
      return {
        success: true,
        item: updatedTask
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
    
    // プロジェクト操作
    getProject,
    listProjects,
    createProject,
    updateProject,
    deleteProject,
    
    // アーティファクト操作
    listProjectArtifacts,
    createArtifact,
    
    // タスク操作
    listProjectTasks,
    createTask,
    updateTask,
    
    // ユーティリティ
    resetError
  };
};

export default useCreativeProject;