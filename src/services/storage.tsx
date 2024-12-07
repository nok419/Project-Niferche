// 1. StorageServiceの作成
// src/services/storage.tsx
import { getUrl, uploadData, downloadData } from 'aws-amplify/storage';

export class StorageService {
  // コンテンツの取得
  async getContent(path: string) {
    try {
      const result = await getUrl({
        path: path,
        options: {
          validateObjectExistence: true
        }
      });
      return result;
    } catch (error) {
      console.error('Error fetching content:', error);
      throw error;
    }
  }

  // コンテンツのアップロード
  async uploadContent(path: string, file: File, metadata?: Record<string, string>) {
    try {
      const result = await uploadData({
        path: path,
        data: file,
        options: {
          metadata
        }
      }).result;
      return result;
    } catch (error) {
      console.error('Error uploading content:', error);
      throw error;
    }
  }

  // カスタムフックの作成
  async listContents(prefix: string) {
    // 実装予定
  }
}