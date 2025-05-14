// amplify/backend.ts
import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';
import { defineParam } from '@aws-amplify/backend';

/**
 * 共有パラメータ定義
 */
// ストレージ設定
const storageBucketName = defineParam('storageBucketName', 'niferche-content');
const awsRegion = defineParam('awsRegion', 'ap-northeast-1');

// セクション区分
const sectionA = defineParam('sectionA', 'site');
const sectionB = defineParam('sectionB', 'niferche');
const sectionC = defineParam('sectionC', 'laboratory');

// 世界設定
const worldTypes = defineParam('worldTypes', ['COMMON', 'HODEMEI', 'QUXE', 'ALSAREJIA']);

// セキュリティ設定
const mfaEnabled = defineParam('mfaEnabled', true);
const sessionDuration = defineParam('sessionDuration', 86400); // 24時間（秒単位）
const refreshTokenValidity = defineParam('refreshTokenValidity', 30); // 30日（日単位）

/**
 * バックエンド統合定義
 * - 認証、データ、ストレージを統合
 * - 環境変数を構成
 * - 区画別アクセスポリシーを適用
 */
const backend = defineBackend({
  auth,
  data,
  storage
});

// バックエンドリソースのエクスポート
export const { 
  auth: authOutput, 
  data: dataOutput, 
  storage: storageOutput 
} = backend;