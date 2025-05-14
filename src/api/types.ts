// src/api/types.ts

/**
 * コンテンツカテゴリ
 */
export enum ContentCategory {
  MAIN_STORY = 'MAIN_STORY',
  SIDE_STORY = 'SIDE_STORY',
  MATERIAL = 'MATERIAL',
  CHARACTER = 'CHARACTER',
  GLOSSARY = 'GLOSSARY',
  ANNOUNCEMENT = 'ANNOUNCEMENT'
}

/**
 * 世界タイプ
 */
export enum WorldCategory {
  COMMON = 'COMMON',
  HODEMEI = 'HODEMEI',
  QUXE = 'QUXE',
  ALSAREJIA = 'ALSAREJIA'
}

/**
 * 公開状態
 */
export enum ContentStatus {
  DRAFT = 'DRAFT',
  REVIEW = 'REVIEW',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED'
}

/**
 * 可視性
 */
export enum Visibility {
  PUBLIC = 'PUBLIC',
  AUTHENTICATED = 'AUTHENTICATED',
  PRIVATE = 'PRIVATE'
}

/**
 * 創作物参照タイプ
 */
export enum ReferenceType {
  BASED_ON = 'BASED_ON',
  INSPIRED_BY = 'INSPIRED_BY',
  EXTENDS = 'EXTENDS',
  RELATED = 'RELATED'
}

/**
 * Laboratory固有の列挙型定義
 */
// 創作ライフサイクル状態
export enum CreativeLifecycleStatus {
  CONCEPT = 'CONCEPT',        // 構想段階
  PLANNING = 'PLANNING',      // 計画段階
  EXECUTION = 'EXECUTION',    // 実行段階
  REVIEW = 'REVIEW',          // レビュー段階
  REVISION = 'REVISION',      // 修正段階
  COMPLETION = 'COMPLETION',  // 完成段階
  ARCHIVED = 'ARCHIVED'       // アーカイブ
}

// 創作物タイプ
export enum CreativeArtifactType {
  DOCUMENT = 'DOCUMENT',      // 文書
  IMAGE = 'IMAGE',            // 画像
  AUDIO = 'AUDIO',            // 音声
  VIDEO = 'VIDEO',            // 動画
  MIXED = 'MIXED',            // 複合
  INTERACTIVE = 'INTERACTIVE' // インタラクティブ
}

// プロジェクトタイプ
export enum ProjectType {
  STORY = 'STORY',            // 物語
  WORLDBUILDING = 'WORLDBUILDING', // 世界観構築
  CHARACTER = 'CHARACTER',    // キャラクター設計
  GAME = 'GAME',              // ゲーム
  INTERACTIVE = 'INTERACTIVE' // インタラクティブ体験
}

/**
 * コンテンツ参照型
 */
export interface ContentReference {
  contentId: string;
  relationType: ReferenceType;
}

/**
 * ストレージ参照型
 */
export interface StorageReference {
  key: string;
  fileName: string;
  contentType: string;
  size?: number;
}

/**
 * コラボレーター情報型
 */
export interface Collaborator {
  userId: string;
  role: string;
  permissions: string[];
}

/**
 * 創作タスク期間型
 */
export interface TaskPeriod {
  startDate?: string;
  endDate?: string;
  estimatedHours?: number;
}

/**
 * NifercheContentモデル型
 */
export interface NifercheContent {
  id: string;
  title: string;
  description: string;
  content?: string;
  category: ContentCategory;
  worldType: WorldCategory;
  tags?: string[];
  status: ContentStatus;
  visibility: Visibility;
  relatedContents?: ContentReference[];
  characterRefs?: string[];
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  version: number;
  mainImage?: StorageReference;
  contentFiles?: StorageReference[];
  authorId: string;
  collaborators?: Collaborator[];
  comments?: ContentComment[];
}

/**
 * ContentCommentモデル型
 */
export interface ContentComment {
  id: string;
  contentId: string;
  text: string;
  authorId: string;
  createdAt: string;
  status: 'ACTIVE' | 'HIDDEN' | 'DELETED';
  content?: NifercheContent;
}

/**
 * Characterモデル型
 */
export interface Character {
  id: string;
  name: string;
  worldType: WorldCategory;
  description: string;
  biography?: string;
  attributes?: any;
  relationships?: any;
  status: ContentStatus;
  visibility: Visibility;
  mainImage?: StorageReference;
  createdAt: string;
  updatedAt: string;
  authorId: string;
}

/**
 * CreativeProjectモデル型
 */
export interface CreativeProject {
  id: string;
  title: string;
  description: string;
  projectType: ProjectType;
  lifecycleStatus: CreativeLifecycleStatus;
  visibility: Visibility;
  worldReference?: WorldCategory;
  tags?: string[];
  startDate?: string;
  targetDate?: string;
  completedDate?: string;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  collaborators?: Collaborator[];
  tasks?: CreativeTask[];
  milestones?: CreativeMilestone[];
  artifacts?: CreativeArtifact[];
}

/**
 * CreativeTaskモデル型
 */
export interface CreativeTask {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'BLOCKED' | 'CANCELLED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  period: TaskPeriod;
  assigneeId?: string;
  dependsOn?: string[];
  milestoneId?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  project?: CreativeProject;
  milestone?: CreativeMilestone;
  artifacts?: CreativeArtifact[];
}

/**
 * CreativeMilestoneモデル型
 */
export interface CreativeMilestone {
  id: string;
  projectId: string;
  title: string;
  description: string;
  targetDate: string;
  status: 'PENDING' | 'REACHED' | 'MISSED' | 'RESCHEDULED';
  createdAt: string;
  updatedAt: string;
  reachedAt?: string;
  project?: CreativeProject;
  tasks?: CreativeTask[];
}

/**
 * CreativeArtifactモデル型
 */
export interface CreativeArtifact {
  id: string;
  projectId: string;
  taskId?: string;
  title: string;
  description: string;
  artifactType: CreativeArtifactType;
  storageReferences: StorageReference[];
  thumbnailReference?: StorageReference;
  version: number;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  project?: CreativeProject;
  task?: CreativeTask;
}

/**
 * Announcementモデル型
 */
export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: 'IMPORTANT' | 'SYSTEM' | 'CONTENT' | 'EVENT';
  isHighlighted: boolean;
  publishedAt: string;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
  authorId: string;
}

/**
 * UserProfileモデル型
 */
export interface UserProfile {
  id: string;
  userId: string;
  nickname: string;
  email: string;
  bio?: string;
  avatarKey?: string;
  profileVisibility: 'PUBLIC' | 'PRIVATE';
  preferences?: any;
  lastLoginAt: string;
  createdAt: string;
  updatedAt: string;
  role: 'USER' | 'CONTENT_CREATOR' | 'CONTENT_MANAGER' | 'ADMIN';
  laboratoryRole?: 'USER' | 'RESEARCHER' | 'ADMIN';
}