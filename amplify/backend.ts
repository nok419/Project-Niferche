// amplify/backend.ts
import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';
import { defineParam } from '@aws-amplify/backend';

/**
 * 共有パラメータ定義 - 環境ごとにオーバーライド可能
 */
// ストレージ設定
const storageBucketName = defineParam('storageBucketName', {
  prod: 'niferche-content-prod',
  dev: 'niferche-content-dev',
  default: 'niferche-content'
});

const awsRegion = defineParam('awsRegion', {
  prod: 'ap-northeast-1',
  dev: 'ap-northeast-1',
  default: 'ap-northeast-1'
});

// セクション区分
const sectionA = defineParam('sectionA', 'site');
const sectionB = defineParam('sectionB', 'niferche');
const sectionC = defineParam('sectionC', 'laboratory');

// 世界設定
const worldTypes = defineParam('worldTypes', ['COMMON', 'HODEMEI', 'QUXE', 'ALSAREJIA']);

// セキュリティ設定 - 環境ごとにオーバーライド可能
const mfaEnabled = defineParam('mfaEnabled', {
  prod: true,
  dev: false,
  default: true
});

const sessionDuration = defineParam('sessionDuration', 86400); // 24時間（秒単位）
const refreshTokenValidity = defineParam('refreshTokenValidity', 30); // 30日（日単位）

/**
 * オブザーバビリティ設定 - 本番環境での監視強化
 */
const enableCloudWatchMetrics = defineParam('enableCloudWatchMetrics', {
  prod: true,
  dev: false,
  default: false
});

const enableXRayTracing = defineParam('enableXRayTracing', {
  prod: true,
  dev: false,
  default: false
});

/**
 * パフォーマンス設定 - キャッシュ戦略
 */
const dataCacheTtl = defineParam('dataCacheTtl', {
  prod: 300, // 5分
  dev: 60,   // 1分
  default: 0 // キャッシュなし
});

/**
 * バックエンド統合定義
 * - 認証、データ、ストレージを統合
 * - 環境変数を構成
 * - 区画別アクセスポリシーを適用
 * - 環境ごとの最適化設定を適用
 */
const backend = defineBackend({
  auth,
  data,
  storage,
  // Amplify Gen 2の最新機能を活用した構成
  config: {
    // 環境ごとの最適化設定
    observability: {
      cloudWatchMetrics: enableCloudWatchMetrics,
      xRay: enableXRayTracing
    },
    // データキャッシュ
    caching: {
      ttl: dataCacheTtl
    }
  }
});

// バックエンドリソースのエクスポート
export const { 
  auth: authOutput, 
  data: dataOutput, 
  storage: storageOutput 
} = backend;