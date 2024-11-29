// src/hooks/useContent.ts
import { generateClient } from 'aws-amplify/api';
import { type Schema } from '../amplify/data/resource';

const client = generateClient<Schema>();

export const useContent = () => {
  const fetchContent = async (contentId: string) => {
    try {
      const response = await client.models.Content.get({
        contentId: contentId
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching content:', error);
      return null;
    }
  };

  const listContents = async (options?: {
    filter?: any;
    limit?: number;
  }) => {
    try {
      const response = await client.models.Content.list(options);
      return response.data;
    } catch (error) {
      console.error('Error listing contents:', error);
      return [];
    }
  };

  return {
    fetchContent,
    listContents
  };
};