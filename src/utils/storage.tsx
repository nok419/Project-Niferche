
// src/utils/storage.tsx
import { StorageService, UploadOptions, StorageResult } from '../services/storage';
import { useState, useCallback } from 'react';

export interface UploadState {
  isUploading: boolean;
  progress: number;
  error: Error | null;
  result: StorageResult | null;
}

export interface UseUploadOptions extends Omit<UploadOptions, 'onProgress'> {
  autoUpload?: boolean;
}

/**
 * ファイルアップロードのためのカスタムフック
 */
export const useFileUpload = (initialOptions?: UseUploadOptions) => {
  const [state, setState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    error: null,
    result: null
  });

  const uploadFile = useCallback(
    async (file: File, options?: UseUploadOptions) => {
      const uploadOptions: UploadOptions = {
        ...(initialOptions || {}),
        ...(options || {}),
        path: options?.path || initialOptions?.path || 'temp/uploads',
        onProgress: (progress) => {
          setState(prev => ({
            ...prev,
            progress: Math.round((progress.loaded / progress.total) * 100)
          }));
        }
      };

      setState({
        isUploading: true,
        progress: 0,
        error: null,
        result: null
      });

      try {
        const result = await StorageService.uploadFile(file, uploadOptions);
        setState({
          isUploading: false,
          progress: 100,
          error: null,
          result
        });
        return result;
      } catch (error) {
        setState({
          isUploading: false,
          progress: 0,
          error: error instanceof Error ? error : new Error('Unknown error'),
          result: null
        });
        throw error;
      }
    },
    [initialOptions]
  );

  return {
    ...state,
    uploadFile,
    reset: () => setState({
      isUploading: false,
      progress: 0,
      error: null,
      result: null
    })
  };
};

/**
 * コンテンツタイプに基づいて適切なストレージパスを生成
 */
export const getStoragePath = (
  category: string,
  visibility: 'public' | 'authenticated' | 'private',
  userId: string,
  contentType: string
): string => {
  // コンテンツタイプに基づいてパスの先頭部分を決定
  let basePath = '';
  
  if (contentType === 'main-story' || contentType === 'side-story') {
    basePath = 'laboratory';
  } else if (contentType.includes('material')) {
    basePath = 'materials';
  } else {
    basePath = 'common';
  }
  
  // 完全なパスを構築
  return `shared/${basePath}/${category}/${visibility}/${userId}`;
};

// サムネイル用のキー生成
export const generateThumbnailKey = (originalKey: string): string => {
  const parts = originalKey.split('.');
  const extension = parts.pop();
  return `${parts.join('.')}_thumb.${extension}`;
};

// Content-Typeの取得
export const getContentType = (fileName: string): string => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  const contentTypes: { [key: string]: string } = {
    'txt': 'text/plain',
    'html': 'text/html',
    'css': 'text/css',
    'js': 'application/javascript',
    'json': 'application/json',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'svg': 'image/svg+xml',
    'pdf': 'application/pdf',
    'md': 'text/markdown',
    'mp3': 'audio/mpeg',
    'mp4': 'video/mp4',
    'wav': 'audio/wav',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    // 必要に応じて追加
  };
  return contentTypes[extension || ''] || 'application/octet-stream';
};