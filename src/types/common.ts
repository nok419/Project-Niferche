// File: src/types/common.ts
// APIエラータイプ
export interface ApiError {
  name: string;
  message: string;
  code?: string;
  stack?: string;
}

// APIレスポンス型
export interface ApiResponse<T> {
  data: T | null;
  errors?: ApiError[];
}

// ページネーションオプション
export interface PaginationOptions {
  limit?: number;
  nextToken?: string;
}

// フィルターオプション
export interface FilterOptions {
  [key: string]: any;
}

// ベースエンティティ型（すべてのモデルの基本情報）
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// 可視性オプション
export enum Visibility {
  PUBLIC = 'PUBLIC',
  AUTHENTICATED = 'AUTHENTICATED',
  GROUP = 'GROUP',
  PRIVATE = 'PRIVATE'
}

// コンテンツステータス
export enum ContentStatus {
  DRAFT = 'DRAFT',
  REVIEW = 'REVIEW',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED'
}

// 区画識別子
export enum AreaId {
  SITE_ADMIN = 'area_a',
  PROJECT_NIFERCHE = 'area_b',
  LABORATORY = 'area_c'
}

// 世界タイプ
export type WorldType = 'common' | 'hodemei' | 'quxe' | 'alsarejia' | 'laboratory';

// 世界カテゴリ
export enum WorldCategory {
  COMMON = 'COMMON',
  QUXE = 'QUXE',
  HODEMEI = 'HODEMEI',
  ALSAREJIA = 'ALSAREJIA'
}

// 帰属
export enum Attribution {
  OFFICIAL = 'OFFICIAL',
  SHARED = 'SHARED',
  PERSONAL = 'PERSONAL'
}

// リファレンスタイプ
export interface ContentReference {
  contentId: string;
  relationType: 'BASED_ON' | 'INSPIRED_BY' | 'EXTENDS' | 'RELATED';
}

// ストレージ参照
export interface StorageReference {
  key: string;
  fileType: string;
  fileName: string;
  size?: number;
  lastModified?: string;
}

// コラボレーター情報
export interface Collaborator {
  userId: string;
  role: string;
  permissions: string[];
  addedAt: string;
}

// Project Niferche 区画固有のコンテンツタイプ
export enum PNContentCategory {
  MAIN_STORY = 'MAIN_STORY',
  SIDE_STORY = 'SIDE_STORY',
  SETTING_MATERIAL = 'SETTING_MATERIAL',
  CHARACTER = 'CHARACTER',
  ORGANIZATION = 'ORGANIZATION'
}

// Laboratory 区画固有のコンテンツタイプ
export enum LabContentCategory {
  THEORY = 'THEORY',
  RESEARCH = 'RESEARCH',
  CONCEPT = 'CONCEPT',
  PROTOTYPE = 'PROTOTYPE',
  CREATIVE_PROCESS = 'CREATIVE_PROCESS'
}

// サイト管理 区画固有のコンテンツタイプ
export enum SiteContentCategory {
  SITE_INFO = 'SITE_INFO',
  ANNOUNCEMENT = 'ANNOUNCEMENT',
  MERCHANDISE = 'MERCHANDISE'
}

// コンテンツ結果ページネーション型
export interface ContentResult<T> {
  items: T[];
  nextToken?: string;
}

// 作成結果型
export interface CreateResult<T> {
  success: boolean;
  item?: T;
  error?: ApiError;
}

// 更新結果型
export interface UpdateResult<T> {
  success: boolean;
  item?: T;
  error?: ApiError;
}

// 削除結果型
export interface DeleteResult {
  success: boolean;
  id?: string;
  error?: ApiError;
}

// Laboratory固有のライフサイクルステータス
export enum CreativeLifecycleStatus {
  IDEA = 'IDEA',
  CONCEPT = 'CONCEPT',
  PLANNING = 'PLANNING',
  PROTOTYPE = 'PROTOTYPE',
  DEVELOPMENT = 'DEVELOPMENT',
  REVIEW = 'REVIEW',
  COMPLETED = 'COMPLETED',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED'
}

// 共通のユーザープロファイル
export interface UserProfile extends BaseEntity {
  userId: string;
  nickname: string;
  email: string;
  role: string; 
  groups?: string[];
  badges?: string[];
  profileVisibility: 'public' | 'private';
  lastLoginAt?: string;
  areaPreferences?: Record<string, any>;
}

// バッジ型
export interface Badge extends BaseEntity {
  name: string;
  description: string;
  imageKey?: string;
  areaId: AreaId;
  requirementType: string;
  requirement: string;
  priority: number;
  isSecret: boolean;
}

// バッジ進捗型
export interface BadgeProgress extends BaseEntity {
  userId: string;
  badgeId: string;
  progress: number;
  isCompleted: boolean;
  completedAt?: string;
  lastUpdatedAt: string;
}

// スタイル関連の型定義
export interface StyleProps {
  className?: string;
  style?: React.CSSProperties;
}

// ナビゲーション表示バリアント
export type NavigationVariant = 'sidebar' | 'tabs' | 'dropdown' | 'breadcrumb' | 'worldMap';

// 方向
export type Orientation = 'horizontal' | 'vertical';

// カードバリアント
export type CardVariant = 'standard' | 'compact' | 'featured' | 'mini' | 'gallery' | 'story' | 'laboratory' | 'material';

// カードサイズ
export type Size = 'small' | 'medium' | 'large';

// 属性タイプ
export type AttributeType = 'normal' | 'special' | 'rare' | 'exclusive';

// レスポンシブブレークポイント
export const breakpoints = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1400
};