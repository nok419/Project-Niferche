// ------------------------------------------------------
// 3. useInfiniteContents に "resetItems" メソッドを追加
//    フィルタ条件が変わった時に itemsを再初期化できるように
// ------------------------------------------------------
// src/hooks/useInfiniteContents.tsx

import { useState, useCallback } from 'react';
import { generateClient } from 'aws-amplify/api';
import { type Schema } from '../../amplify/data/resource';

interface ListContentOptions {
  filter?: Record<string, any>;
  limit?: number;
}

export const useInfiniteContents = () => {
  const client = generateClient<Schema>();

  const [items, setItems] = useState<any[]>([]);
  const [nextToken, setNextToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // 新規メソッド: items をリセット
  const resetItems = useCallback(() => {
    setItems([]);
    setNextToken(null);
    setError('');
  }, []);

  const loadMore = useCallback(async (options: ListContentOptions = {}) => {
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
      setItems((prev) => [...prev, ...data]);
      setNextToken(resp.nextToken || null);
    } catch (e: any) {
      setError(e.message);
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
