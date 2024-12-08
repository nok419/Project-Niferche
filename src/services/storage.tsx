// src/services/storage.tsx
import { getUrl, downloadData, list, uploadData, remove } from 'aws-amplify/storage';

interface StorageConfig {
  bucket: string;
  region: string;
}

export class StorageService {
  private static async getConfig(): Promise<StorageConfig> {
    try {
      // 設定の取得は同期的に
      const config = {
        bucket: import.meta.env.VITE_STORAGE_BUCKET || 'niferche-content',
        region: import.meta.env.VITE_AWS_REGION || 'ap-northeast-1'
      };

      console.log('Storage config:', config);
      return config;
    } catch (error) {
      console.error('Config error:', error);
      throw error;
    }
  }

  static async listFiles(path: string, options: { recursive?: boolean; prefix?: string } = {}) {
    try {
      const config = await this.getConfig();
      const result = await list({
        path,
        options: {
          bucket: config.bucket,
          listAll: true,
          ...options
        }
      });
      console.log('List files result:', result);

      // ディレクトリを除外し、実ファイルのみを返す
      return result.items.filter(item => !item.path.endsWith('/'));
    } catch (error) {
      console.error('Error listing files:', error);
      throw new Error(error instanceof Error ? error.message : 'ファイル一覧の取得に失敗しました');
    }
  }

  static async getFileUrl(path: string, expiresIn: number = 3600): Promise<string> {
    try {
      const config = await this.getConfig();
      const result = await getUrl({
        path,
        options: {
          bucket: config.bucket,
          validateObjectExistence: true,
          expiresIn
        }
      });
      return result.url.toString();
    } catch (error) {
      console.error('Error getting file URL:', error);
      throw new Error(error instanceof Error ? error.message : 'ファイルURLの取得に失敗しました');
    }
  }

  static async getTextContent(path: string): Promise<string> {
    try {
      const config = await this.getConfig();
      const response = await downloadData({
        path,
        options: {
          bucket: config.bucket
        }
      }).result;
      return await response.body.text();
    } catch (error) {
      console.error('Error downloading text content:', error);
      throw new Error(error instanceof Error ? error.message : 'テキストコンテンツの取得に失敗しました');
    }
  }

  static async uploadFile(path: string, file: File, metadata?: Record<string, string>) {
    try {
      const config = await this.getConfig();
      const result = await uploadData({
        path,
        data: file,
        options: {
          bucket: config.bucket,
          metadata,
          contentType: file.type
        }
      }).result;
      return result;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error(error instanceof Error ? error.message : 'ファイルのアップロードに失敗しました');
    }
  }

  static async deleteFile(path: string) {
    try {
      const config = await this.getConfig();
      await remove({
        path,
        options: {
          bucket: config.bucket
        }
      });
    } catch (error) {
      console.error('Error deleting file:', error);
      throw new Error(error instanceof Error ? error.message : 'ファイルの削除に失敗しました');
    }
  }

  static async getFileMetadata(path: string) {
    try {
      const config = await this.getConfig();
      const result = await list({
        path,
        options: {
          bucket: config.bucket
        }
      });

      const file = result.items.find(item => item.path === path);
      if (!file) {
        throw new Error('File not found');
      }

      return {
        size: file.size,
        lastModified: file.lastModified,
        eTag: file.eTag
      };
    } catch (error) {
      console.error('Error getting file metadata:', error);
      throw new Error(error instanceof Error ? error.message : 'ファイルメタデータの取得に失敗しました');
    }
  }
  
}