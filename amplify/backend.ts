// amplify/backend.ts
import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';

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

// 環境変数と設定情報の出力
backend.addOutput({
  // ストレージ設定
  storage: {
    bucket_name: 'niferche-content',
    aws_region: 'ap-northeast-1'
  },
  
  // データ関連情報
  data: {
    // セクション区分
    section_info: {
      section_a: 'site',
      section_b: 'niferche',
      section_c: 'laboratory'
    },
    
    // 世界設定
    world_types: [
      'COMMON',
      'HODEMEI',
      'QUXE',
      'ALSAREJIA'
    ]
  },
  
  // 認証関連情報
  auth: {
    // ユーザーグループ
    user_groups: [
      'ADMIN',
      'CONTENT_MANAGER',
      'CONTENT_CREATOR',
      'LABORATORY_ADMIN',
      'LABORATORY_USER',
      'USER'
    ],
    
    // セキュリティ設定
    mfa_enabled: true,
    session_duration: 86400, // 24時間（秒単位）
    refresh_token_validity: 30 // 30日（日単位）
  }
});

// バックエンドリソースのエクスポート
export const { 
  auth: authOutput, 
  data: dataOutput, 
  storage: storageOutput 
} = backend;