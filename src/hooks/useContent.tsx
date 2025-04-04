// src/hooks/useContent.tsx
import { generateClient } from 'aws-amplify/api';
import { type Schema } from '../../amplify/data/resource';
import { useState } from 'react';
import { getUrl, uploadData } from 'aws-amplify/storage';
import { ApiError, ApiResponse, FilterOptions, PaginationOptions } from '../types/common';
import { Content, ContentResult } from '../types/content';

const client = generateClient<Schema>();

// より具体的な型でリクエストオプションを定義
export interface ContentOptions extends PaginationOptions {
  filter?: FilterOptions;
}

// 型パラメータ付きフックに変更
export const useContent = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  // コンテンツの取得
  const getContent = async (id: string): Promise<Content | null> => {
    setLoading(true);
    try {
      const response = await client.models.Content.get({ id });
      return response.data as unknown as Content;
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
      const response = await client.models.Content.list(options);
      return {
        items: (response.data || []) as unknown as Content[],
        nextToken: response.nextToken || undefined
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

  // ストレージからファイルのURLを取得
  const getFileUrl = async (path: string): Promise<string> => {
    try {
      const response = await getUrl({
        path,
        options: { validateObjectExistence: true }
      });
      return response.url.toString();
    } catch (e) {
      const apiError = e as ApiError;
      setError({
        name: apiError.name || 'Error',
        message: apiError.message || 'Failed to get file URL',
        code: apiError.code,
        stack: apiError.stack
      });
      throw apiError;
    }
  };

  // ファイルのアップロード
  const uploadFile = async (path: string, file: File, metadata?: Record<string, string>) => {
    try {
      const response = await uploadData({
        path,
        data: file,
        options: { metadata }
      }).result;
      return response;
    } catch (e) {
      const apiError = e as ApiError;
      setError({
        name: apiError.name || 'Error',
        message: apiError.message || 'Failed to upload file',
        code: apiError.code,
        stack: apiError.stack
      });
      throw apiError;
    }
  };

  // エラーリセット関数追加
  const resetError = () => {
    setError(null);
  };

  return {
    loading,
    error,
    getContent,
    listContents,
    getFileUrl,
    uploadFile,
    resetError
  };
};