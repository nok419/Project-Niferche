// src/hooks/useContent.ts
import { generateClient } from 'aws-amplify/api';
import { type Schema } from '../../amplify/data/resource';
import { useState } from 'react';
import { getUrl, uploadData } from 'aws-amplify/storage';

const client = generateClient<Schema>();

interface ContentOptions {
  filter?: Record<string, any>;
  limit?: number;
  nextToken?: string;
}

export const useContent = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // コンテンツの取得
  const getContent = async (id: string) => {
    setLoading(true);
    try {
      const response = await client.models.Content.get({ id });
      return response.data;
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Failed to get content'));
      throw e;
    } finally {
      setLoading(false);
    }
  };

  // コンテンツ一覧の取得
  const listContents = async (options?: ContentOptions) => {
    setLoading(true);
    try {
      const response = await client.models.Content.list(options);
      return response.data;
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Failed to list contents'));
      throw e;
    } finally {
      setLoading(false);
    }
  };

  // ストレージからファイルのURLを取得
  const getFileUrl = async (path: string) => {
    try {
      const response = await getUrl({
        path,
        options: { validateObjectExistence: true }
      });
      return response.url.toString();
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Failed to get file URL'));
      throw e;
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
      setError(e instanceof Error ? e : new Error('Failed to upload file'));
      throw e;
    }
  };

  return {
    loading,
    error,
    getContent,
    listContents,
    getFileUrl,
    uploadFile
  };
};
