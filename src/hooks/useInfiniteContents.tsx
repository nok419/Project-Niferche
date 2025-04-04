// src/hooks/useInfiniteContents.tsx
import { useState, useCallback } from 'react';
import { generateClient } from 'aws-amplify/api';
import { type Schema } from '../../amplify/data/resource';
import { Content } from '../types/content';
import { ApiError, FilterOptions } from '../types/common';

interface InfiniteContentOptions {
  filter?: FilterOptions;
  limit?: number;
}

export const useInfiniteContents = () => {
  const client = generateClient<Schema>();

  const [items, setItems] = useState<Content[]>([]);
  const [nextToken, setNextToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  // 項目リセット関数
  const resetItems = useCallback(() => {
    setItems([]);
    setNextToken(null);
    setError(null);
  }, []);

  // データ読み込み関数
  const loadMore = useCallback(async (options: InfiniteContentOptions = {}) => {
    try {
      setLoading(true);
      const resp = await client.models.Content.list({
        ...options,
        nextToken,
      });

      if (resp.errors && resp.errors.length > 0) {
        throw new Error(resp.errors[0].message);
      }
      
      const data = resp.data || [];
      setItems((prev) => [...prev, ...(data as unknown as Content[])]);
      setNextToken(resp.nextToken || null);
    } catch (e) {
      const apiError = e as ApiError;
      setError({
        name: apiError.name || 'Error',
        message: apiError.message || 'Failed to load more content',
        code: apiError.code,
        stack: apiError.stack
      });
    } finally {
      setLoading(false);
    }
  }, [client, nextToken]);

  return {
    items,
    loadMore,
    hasMore: nextToken != null,
    loading,
    error,
    resetItems,
  };
};