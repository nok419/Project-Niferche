// File: src/api/hooks/common/useContent.ts
import { useState, useCallback, useMemo } from 'react';
import { 
  AreaId,
  ContentResult,
  PaginationOptions, 
  FilterOptions
} from '../../../types/common';

// 各区画のフックをインポート
import useProjectNifercheContent, { 
  ProjectNifercheContent 
} from '../projectNiferche/useProjectNifercheContent';
import useCreativeProject, { 
  CreativeProject,
  CreativeArtifact 
} from '../laboratory/useCreativeProject';

// 区画ごとのコンテンツタイプをユニオン型に
export type AreaContent = 
  | { areaId: AreaId.PROJECT_NIFERCHE; content: ProjectNifercheContent }
  | { areaId: AreaId.LABORATORY; content: CreativeProject | CreativeArtifact };

// コンテンツクエリオプション（区画指定を含む）
export interface ContentQueryOptions extends PaginationOptions {
  filter?: FilterOptions;
  includeAreas?: AreaId[];
  excludeAreas?: AreaId[];
  useCache?: boolean;
  cacheDuration?: number;
}

/**
 * 統合的なコンテンツ取得フック - 複数の区画からのデータを統合
 */
export const useContent = () => {
  // 各区画固有のフックをインスタンス化
  const pnHook = useProjectNifercheContent();
  const labHook = useCreativeProject();
  
  // 共通の状態管理
  const [loading, setLoading] = useState(false);
  
  // 各フックのローディング状態を監視
  const isAnyLoading = useMemo(() => {
    return pnHook.loading || labHook.loading;
  }, [pnHook.loading, labHook.loading]);
  
  // 各フックのエラー状態を統合
  const errors = useMemo(() => {
    return {
      projectNiferche: pnHook.error,
      laboratory: labHook.error
    };
  }, [pnHook.error, labHook.error]);
  
  /**
   * 複数区画からコンテンツを統合して取得
   */
  const getContent = useCallback(async (
    id: string,
    areaId: AreaId,
    options?: { useCache?: boolean; cacheDuration?: number }
  ): Promise<AreaContent | null> => {
    setLoading(true);
    
    try {
      switch (areaId) {
        case AreaId.PROJECT_NIFERCHE: {
          const content = await pnHook.getContent(id, options);
          return content ? { areaId, content } : null;
        }
        case AreaId.LABORATORY: {
          // まずプロジェクトとして検索
          const project = await labHook.getProject(id, options);
          if (project) {
            return { areaId, content: project };
          }
          
          // TODO: アーティファクト取得ロジックを追加（必要に応じて）
          
          return null;
        }
        default:
          return null;
      }
    } finally {
      setLoading(false);
    }
  }, [pnHook, labHook]);
  
  /**
   * 複数の区画からコンテンツを一覧取得して統合
   */
  const listContents = useCallback(async (
    options?: ContentQueryOptions
  ): Promise<ContentResult<AreaContent>> => {
    const { 
      limit = 20, 
      includeAreas, 
      excludeAreas, 
      useCache = true,
      cacheDuration = 30
    } = options || {};
    
    setLoading(true);
    
    try {
      // デフォルトですべての区画を含める
      const areasToInclude = includeAreas || Object.values(AreaId);
      
      // 除外する区画があれば、includeAreasから削除
      const filteredAreas = excludeAreas 
        ? areasToInclude.filter(area => !excludeAreas.includes(area))
        : areasToInclude;
      
      // 各区画からコンテンツを並行取得
      const results = await Promise.all(
        filteredAreas.map(async (areaId) => {
          try {
            switch (areaId) {
              case AreaId.PROJECT_NIFERCHE: {
                const result = await pnHook.listContents({
                  limit,
                  useCache,
                  cacheDuration
                });
                return result.items.map(content => ({ 
                  areaId, 
                  content 
                }));
              }
              case AreaId.LABORATORY: {
                const result = await labHook.listProjects({
                  limit,
                  useCache,
                  cacheDuration
                });
                return result.items.map(content => ({ 
                  areaId, 
                  content 
                }));
              }
              default:
                return [];
            }
          } catch (error) {
            console.error(`Failed to fetch content from area ${areaId}:`, error);
            return [];
          }
        })
      );
      
      // すべての結果を統合
      const allItems = results.flat();
      
      // 指定された制限に従ってアイテムをスライス
      const limitedItems = allItems.slice(0, limit);
      
      return {
        items: limitedItems,
        // 単純な続きがあるかどうかの判定（実際の実装ではより複雑になる可能性あり）
        nextToken: allItems.length > limit ? 'has_more' : undefined
      };
    } finally {
      setLoading(false);
    }
  }, [pnHook, labHook]);
  
  /**
   * IDの配列から複数コンテンツを取得
   */
  const getContentsByIds = useCallback(async (
    contentIds: { id: string; areaId: AreaId }[],
    options?: { useCache?: boolean; cacheDuration?: number }
  ): Promise<Record<string, AreaContent | null>> => {
    const result: Record<string, AreaContent | null> = {};
    
    // 区画ごとにグループ化
    const contentsByArea = contentIds.reduce<Record<AreaId, string[]>>((acc, { id, areaId }) => {
      if (!acc[areaId]) {
        acc[areaId] = [];
      }
      acc[areaId].push(id);
      return acc;
    }, {} as Record<AreaId, string[]>);
    
    // Project Niferche区画のコンテンツを取得
    if (contentsByArea[AreaId.PROJECT_NIFERCHE]?.length) {
      const ids = contentsByArea[AreaId.PROJECT_NIFERCHE];
      for (const id of ids) {
        const content = await pnHook.getContent(id, options);
        result[id] = content ? { areaId: AreaId.PROJECT_NIFERCHE, content } : null;
      }
    }
    
    // Laboratory区画のコンテンツを取得
    if (contentsByArea[AreaId.LABORATORY]?.length) {
      const ids = contentsByArea[AreaId.LABORATORY];
      for (const id of ids) {
        const content = await labHook.getProject(id, options);
        result[id] = content ? { areaId: AreaId.LABORATORY, content } : null;
      }
    }
    
    return result;
  }, [pnHook, labHook]);
  
  /**
   * ファイル内容を取得（区画に関係なく共通処理）
   */
  const getFileContent = useCallback(async (
    key: string
  ): Promise<string> => {
    setLoading(true);
    
    try {
      // ここでStorage.getなどを実行する（実際の実装では）
      // return await Storage.get(key, { download: true });
      
      // モック実装（実際の実装では削除）
      await new Promise(resolve => setTimeout(resolve, 300));
      return `# Mock Content for ${key}\n\nThis is a placeholder text for file content.`;
    } finally {
      setLoading(false);
    }
  }, []);
  
  /**
   * エラーをリセット
   */
  const resetErrors = useCallback(() => {
    pnHook.resetError();
    labHook.resetError();
  }, [pnHook, labHook]);
  
  return {
    // 状態
    loading: isAnyLoading,
    errors,
    
    // 共通API
    getContent,
    listContents,
    getContentsByIds,
    getFileContent,
    resetErrors,
    
    // 各区画固有のフックを露出（直接アクセスできるように）
    projectNiferche: pnHook,
    laboratory: labHook
  };
};

export default useContent;