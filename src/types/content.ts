// src/types/content.ts
import { BaseContent, ContentVariant, ContentStatus, WorldCategory, Attribution, ContentVisibility } from './common';

// コンテンツカテゴリ
export enum ContentCategory {
  MAIN_STORY = 'MAIN_STORY',
  SIDE_STORY = 'SIDE_STORY', 
  SETTING_MATERIAL = 'SETTING_MATERIAL',
  CHARACTER = 'CHARACTER',
  ORGANIZATION = 'ORGANIZATION',
  THEORY = 'THEORY',
  MERCHANDISE = 'MERCHANDISE',
  SITE_INFO = 'SITE_INFO'
}

// コンテンツ参照タイプ
export enum ReferenceType {
  BASED_ON = 'BASED_ON',
  INSPIRED_BY = 'INSPIRED_BY',
  EXTENDS = 'EXTENDS',
  RELATED = 'RELATED'
}

// コンテンツ参照
export interface ContentReference {
  contentId: string;
  relationType: ReferenceType;
}

// 拡張コンテンツインターフェース
export interface Content extends BaseContent {
  variant: ContentVariant;
  primaryTypes: string[];
  supplementaryTypes?: string[];
  primaryCategory: ContentCategory;
  secondaryCategories?: string[];
  worldType: WorldCategory;
  attribution: Attribution;
  visibility: ContentVisibility;
  status: ContentStatus;
  tags?: string[];
  sourceRefs?: ContentReference[];
  relatedContent?: ContentReference[];
  characterRefs?: string[];
  itemRefs?: string[];
  createdAt: string;
  updatedAt: string;
  version: string;
  mainKey: string;
  thumbnailKey?: string;
  attachments?: string[];
  ownerId: string;
  collaborators?: string[];
}

// コメント型
export interface Comment {
  id: string;
  contentId: string;
  authorId: string;
  text: string;
  createdAt: string;
  status: 'ACTIVE' | 'HIDDEN' | 'DELETED';
}

// お気に入り項目の型
export interface FavoriteItem {
  contentId: string;
  addedAt: string;
  contentType: string;
}

// APIへのコンテンツ作成リクエスト型
export interface CreateContentInput {
  title: string;
  description: string;
  primaryTypes: string[];
  supplementaryTypes?: string[];
  primaryCategory: ContentCategory;
  secondaryCategories?: string[];
  worldType: WorldCategory;
  attribution: Attribution;
  visibility: ContentVisibility;
  status: ContentStatus;
  mainKey: string;
  thumbnailKey?: string;
  ownerId: string;
}

// APIへのコンテンツ更新リクエスト型
export interface UpdateContentInput {
  id: string;
  title?: string;
  description?: string;
  primaryTypes?: string[];
  supplementaryTypes?: string[];
  primaryCategory?: ContentCategory;
  secondaryCategories?: string[];
  worldType?: WorldCategory;
  attribution?: Attribution;
  visibility?: ContentVisibility;
  status?: ContentStatus;
  tags?: string[];
  mainKey?: string;
  thumbnailKey?: string;
  collaborators?: string[];
  version: string; // バージョン管理用
}

// コンテンツフィルタリング用オプション
export interface ContentFilterOptions {
  primaryCategory?: ContentCategory;
  worldType?: WorldCategory;
  attribution?: Attribution;
  visibility?: ContentVisibility;
  status?: ContentStatus;
  tags?: string[];
  ownerId?: string;
}

// コンテンツ検索用オプション
export interface ContentSearchOptions {
  keyword?: string;
  filter?: ContentFilterOptions;
  limit?: number;
  nextToken?: string;
}

// コンテンツ取得結果
export interface ContentResult {
  items: Content[];
  nextToken?: string;
}

// コンテンツ管理用ヘルパー関数
export function isContentAccessible(content: Content, isAuthenticated: boolean, userId?: string): boolean {
  // 公開コンテンツは誰でも閲覧可能
  if (content.visibility === ContentVisibility.PUBLIC) {
    return true;
  }

  // 非公開コンテンツは認証が必要
  if (!isAuthenticated) {
    return false;
  }

  // 認証済みコンテンツはログインしていれば閲覧可能
  if (content.visibility === ContentVisibility.AUTHENTICATED) {
    return true;
  }

  // プライベートコンテンツは所有者か共同編集者のみ閲覧可能
  if (content.visibility === ContentVisibility.PRIVATE) {
    if (!userId) return false;
    
    // 所有者または共同編集者かチェック
    return (
      content.ownerId === userId || 
      (content.collaborators && content.collaborators.includes(userId))
    );
  }

  return false;
}