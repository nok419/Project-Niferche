// src/services/storage.tsx
import { uploadData, getUrl, remove, list } from 'aws-amplify/storage';
import { StorageAccessLevel } from 'aws-amplify/storage';

export interface UploadOptions {
  path: string;
  contentType?: string;
  accessLevel?: StorageAccessLevel;
  metadata?: Record<string, string>;
  onProgress?: (progress: { loaded: number; total: number }) => void;
}

export interface StorageResult {
  key: string;
  url: string;
}

export const StorageService = {
  /**
   * ファイルをアップロードする
   */
  async uploadFile(
    file: File, 
    options: UploadOptions
  ): Promise<StorageResult> {
    try {
      // パスの構築
      const key = `${options.path}/${file.name}`;
      
      // ファイルアップロード
      const result = await uploadData({
        key,
        data: file,
        options: {
          accessLevel: options.accessLevel || 'private',
          contentType: options.contentType || file.type,
          metadata: options.metadata,
          onProgress: options.onProgress
        }
      }).result;
      
      // URLの取得
      const urlResult = await getUrl({
        key,
        options: {
          accessLevel: options.accessLevel || 'private',
          validateObjectExistence: true
        }
      });
      
      return {
        key,
        url: urlResult.url.toString()
      };
    } catch (error) {
      console.error('Storage upload error:', error);
      throw error;
    }
  },
  
  /**
   * ファイルのURLを取得する
   */
  async getFileUrl(
    key: string, 
    accessLevel: StorageAccessLevel = 'private'
  ): Promise<string> {
    try {
      const result = await getUrl({
        key,
        options: {
          accessLevel,
          validateObjectExistence: true
        }
      });
      
      return result.url.toString();
    } catch (error) {
      console.error('Get file URL error:', error);
      throw error;
    }
  },
  
  /**
   * ファイルを削除する
   */
  async deleteFile(
    key: string, 
    accessLevel: StorageAccessLevel = 'private'
  ): Promise<void> {
    try {
      await remove({
        key,
        options: {
          accessLevel
        }
      });
    } catch (error) {
      console.error('Delete file error:', error);
      throw error;
    }
  },
  
  /**
   * 指定したパスのファイル一覧を取得する
   */
  async listFiles(
    path: string, 
    accessLevel: StorageAccessLevel = 'private'
  ): Promise<string[]> {
    try {
      const result = await list({
        prefix: path,
        options: {
          accessLevel
        }
      });
      
      return result.items.map(item => item.key);
    } catch (error) {
      console.error('List files error:', error);
      throw error;
    }
  }
};