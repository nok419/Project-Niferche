// src/services/storage.tsx
import { MockStorageService } from './mockStorage';

// 実際のAWS Storage操作の代わりにモックサービスをエクスポート
export const StorageService = MockStorageService;