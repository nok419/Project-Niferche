// src/hooks/useContentLoader.ts
import { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import type { Schema } from '../../amplify/data/resource';

const client = generateClient<Schema>();

export const useContentLoader = (contentId: string) => {
  const [content, setContent] = useState<Schema['Content']['type'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadContent = async () => {
      try {
        setIsLoading(true);
        const response = await client.models.Content.get({
          id: contentId
        });
        setContent(response.data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
  }, [contentId]);

  return { content, isLoading, error };
};