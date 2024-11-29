import { getUrl, uploadData, remove, list } from 'aws-amplify/storage';

export class StorageService {
  static async uploadFile(path: string, file: File) {
    try {
      const result = await uploadData({
        path: path,
        data: file,
      }).result;
      return result;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  static async getFileUrl(path: string) {
    try {
      const result = await getUrl({
        path: path,
      });
      return result.url.toString();
    } catch (error) {
      console.error('Error getting file URL:', error);
      throw error;
    }
  }

  static async listFiles(path: string) {
    try {
      const result = await list({
        path: path,
      });
      return result.items;
    } catch (error) {
      console.error('Error listing files:', error);
      throw error;
    }
  }

  static async deleteFile(path: string) {
    try {
      await remove({
        path: path,
      });
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }
}