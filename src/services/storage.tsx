// src/services/storage.tsx
import { getUrl,downloadData, list } from 'aws-amplify/storage';

export class StorageService {
  // 既存メソッドの改善
  static async getFileUrl(path: string): Promise<string> {
    try {
      const result = await getUrl({
        path,
        options: { validateObjectExistence: true }
      });
      return result.url.toString();
    } catch (error) {
      console.error('Error getting file URL:', error);
      throw error;
    }
  }

  // ファイル一覧の取得を追加
  static async listFiles(path: string) {
    try {
      const items = await list({
        path,
        options: { listAll: true }
      });
      return items.items;
    } catch (error) {
      console.error('Error listing files:', error);
      throw error;
    }
  }

  // コンテンツの取得（テキストファイル用）
  static async getTextContent(path: string): Promise<string> {
    try {
      const response = await downloadData({
        path,
      }).result;
      return await response.body.text();
    } catch (error) {
      console.error('Error downloading text content:', error);
      throw error;
    }
  }
}