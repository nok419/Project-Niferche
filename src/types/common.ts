// src/types/common.ts

// 基本的なコンテンツインターフェース
export interface BaseContent {
  id: string;
  title: string;
  description: string;
  isAvailable: boolean;
  imagePath?: string;
  reference?: string;
}

// コンテンツの種類
export type ContentVariant = 'document' | 'image' | 'story' | 'interactive';

// アクセスレベル (amplify/data/resource.ts の Visibility に対応)
export enum ContentVisibility {
  PUBLIC = 'PUBLIC',             // 誰でも閲覧可能
  AUTHENTICATED = 'AUTHENTICATED', // ログインユーザーのみ閲覧可能
  PRIVATE = 'PRIVATE'           // 所有者のみアクセス可能
}

// コンテンツステータス
export enum ContentStatus {
  DRAFT = 'DRAFT',         // 下書き
  REVIEW = 'REVIEW',       // レビュー中
  PUBLISHED = 'PUBLISHED', // 公開済み
  ARCHIVED = 'ARCHIVED'    // アーカイブ済み
}

// 世界設定カテゴリ
export enum WorldCategory {
  COMMON = 'COMMON',       // 共通
  QUXE = 'QUXE',           // クーシェ
  HODEMEI = 'HODEMEI',     // ホウデメイ
  ALSAREJIA = 'ALSAREJIA'  // アルサレジア
}

// データソース属性
export enum Attribution {
  OFFICIAL = 'OFFICIAL',   // 公式コンテンツ
  SHARED = 'SHARED'        // 共有コンテンツ
}

// API共通エラー型
export interface ApiError extends Error {
  code?: string;
  name: string;
  statusCode?: number;
}

// API共通レスポンス型
export interface ApiResponse<T> {
  data: T | null;
  errors?: ApiError[];
  nextToken?: string | null;
}

// ページネーション用オプション
export interface PaginationOptions {
  limit?: number;
  nextToken?: string | null;
}

// フィルタリング用オプション
export interface FilterOptions {
  [key: string]: string | number | boolean | null | undefined;
}

// 一般的なリクエストオプション
export interface RequestOptions extends PaginationOptions {
  filter?: FilterOptions;
}