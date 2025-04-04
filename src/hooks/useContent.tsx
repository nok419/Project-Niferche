// src/hooks/useContent.tsx
import { useState } from 'react';
import { ApiError, FilterOptions, PaginationOptions } from '../types/common';
import { Content, ContentResult } from '../types/content';
import { MockStorageService } from '../services/mockStorage';

// より具体的な型でリクエストオプションを定義
export interface ContentOptions extends PaginationOptions {
  filter?: FilterOptions;
}

// モックコンテンツデータ
const MOCK_CONTENTS: Content[] = [
  {
    id: 'content-1',
    title: 'メインストーリー第1章',
    description: 'メインストーリーの第1章です。',
    primaryTypes: ['story'],
    primaryCategory: 'MAIN_STORY',
    worldType: 'COMMON',
    attribution: 'OFFICIAL',
    visibility: 'PUBLIC',
    status: 'PUBLISHED',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
    version: '1.0.0',
    mainKey: 'stories/main/chapter1.txt',
    ownerId: 'admin',
  },
  {
    id: 'content-2',
    title: 'サイドストーリー：始まりの日',
    description: '世界の成り立ちに関するサイドストーリー',
    primaryTypes: ['story'],
    primaryCategory: 'SIDE_STORY',
    worldType: 'QUXE',
    attribution: 'OFFICIAL',
    visibility: 'PUBLIC',
    status: 'PUBLISHED',
    createdAt: '2023-01-02T00:00:00Z',
    updatedAt: '2023-01-02T00:00:00Z',
    version: '1.0.0',
    mainKey: 'stories/side/beginnings.txt',
    ownerId: 'admin',
  },
  {
    id: 'content-3',
    title: 'アイデア体の基礎',
    description: 'アイデア体の基本的な性質に関する研究資料',
    primaryTypes: ['document'],
    primaryCategory: 'THEORY',
    worldType: 'ALSAREJIA',
    attribution: 'OFFICIAL',
    visibility: 'AUTHENTICATED',
    status: 'PUBLISHED',
    createdAt: '2023-01-03T00:00:00Z',
    updatedAt: '2023-01-03T00:00:00Z',
    version: '1.0.0',
    mainKey: 'laboratory/ideas/basic-concept.md',
    ownerId: 'admin',
  }
];

// フック実装
export const useContent = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  // コンテンツの取得
  const getContent = async (id: string): Promise<Content | null> => {
    setLoading(true);
    try {
      // 遅延をシミュレート
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const content = MOCK_CONTENTS.find(item => item.id === id);
      if (!content) {
        throw new Error('Content not found');
      }
      
      return content;
    } catch (e) {
      const apiError = e as ApiError;
      setError({
        name: apiError.name || 'Error',
        message: apiError.message || 'Failed to get content',
        code: apiError.code,
        stack: apiError.stack
      });
      throw apiError;
    } finally {
      setLoading(false);
    }
  };

  // コンテンツ一覧の取得
  const listContents = async (options?: ContentOptions): Promise<ContentResult> => {
    setLoading(true);
    try {
      // 遅延をシミュレート
      await new Promise(resolve => setTimeout(resolve, 300));
      
      let filteredContents = [...MOCK_CONTENTS];
      
      // フィルタリングをシミュレート
      if (options?.filter) {
        const filter = options.filter;
        
        filteredContents = filteredContents.filter(content => {
          let match = true;
          
          // カテゴリでフィルタリング
          if (filter.category && content.primaryCategory !== filter.category) {
            match = false;
          }
          
          // ワールドタイプでフィルタリング
          if (filter.worldType && content.worldType !== filter.worldType) {
            match = false;
          }
          
          return match;
        });
      }
      
      // ページネーションをシミュレート
      const limit = options?.limit || 10;
      const startIndex = 0; // 簡略化のため常に最初のページを返す
      const paginatedContents = filteredContents.slice(startIndex, startIndex + limit);
      
      return {
        items: paginatedContents,
        nextToken: paginatedContents.length === limit ? String(startIndex + limit) : undefined
      };
    } catch (e) {
      const apiError = e as ApiError;
      setError({
        name: apiError.name || 'Error',
        message: apiError.message || 'Failed to list contents',
        code: apiError.code,
        stack: apiError.stack
      });
      throw apiError;
    } finally {
      setLoading(false);
    }
  };

  // ストレージからファイルのコンテンツを取得
  const getFileContent = async (path: string): Promise<string> => {
    try {
      return await MockStorageService.getText(path);
    } catch (e) {
      const apiError = e as ApiError;
      setError({
        name: apiError.name || 'Error',
        message: apiError.message || 'Failed to get file content',
        code: apiError.code,
        stack: apiError.stack
      });
      throw apiError;
    }
  };

  // エラーリセット関数
  const resetError = () => {
    setError(null);
  };

  return {
    loading,
    error,
    getContent,
    listContents,
    getFileContent,
    resetError
  };
};