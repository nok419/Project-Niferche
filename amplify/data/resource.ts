// amplify/data/resource.ts
import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

/**
 * 共通の列挙型定義
 */
// コンテンツカテゴリ
const ContentCategory = {
  MAIN_STORY: 'MAIN_STORY',
  SIDE_STORY: 'SIDE_STORY',
  MATERIAL: 'MATERIAL',
  CHARACTER: 'CHARACTER',
  GLOSSARY: 'GLOSSARY',
  ANNOUNCEMENT: 'ANNOUNCEMENT'
} as const;

// 世界タイプ
const WorldCategory = {
  COMMON: 'COMMON',
  HODEMEI: 'HODEMEI',
  QUXE: 'QUXE',
  ALSAREJIA: 'ALSAREJIA'
} as const;

// 公開状態
const ContentStatus = {
  DRAFT: 'DRAFT',
  REVIEW: 'REVIEW',
  PUBLISHED: 'PUBLISHED',
  ARCHIVED: 'ARCHIVED'
} as const;

// 可視性
const Visibility = {
  PUBLIC: 'PUBLIC',
  AUTHENTICATED: 'AUTHENTICATED',
  PRIVATE: 'PRIVATE'
} as const;

// 創作物参照タイプ
const ReferenceType = {
  BASED_ON: 'BASED_ON',
  INSPIRED_BY: 'INSPIRED_BY',
  EXTENDS: 'EXTENDS',
  RELATED: 'RELATED'
} as const;

/**
 * Laboratory固有の列挙型定義
 */
// 創作ライフサイクル状態
const CreativeLifecycleStatus = {
  CONCEPT: 'CONCEPT',        // 構想段階
  PLANNING: 'PLANNING',      // 計画段階
  EXECUTION: 'EXECUTION',    // 実行段階
  REVIEW: 'REVIEW',          // レビュー段階
  REVISION: 'REVISION',      // 修正段階
  COMPLETION: 'COMPLETION',  // 完成段階
  ARCHIVED: 'ARCHIVED'       // アーカイブ
} as const;

// 創作物タイプ
const CreativeArtifactType = {
  DOCUMENT: 'DOCUMENT',      // 文書
  IMAGE: 'IMAGE',            // 画像
  AUDIO: 'AUDIO',            // 音声
  VIDEO: 'VIDEO',            // 動画
  MIXED: 'MIXED',            // 複合
  INTERACTIVE: 'INTERACTIVE' // インタラクティブ
} as const;

// プロジェクトタイプ
const ProjectType = {
  STORY: 'STORY',            // 物語
  WORLDBUILDING: 'WORLDBUILDING', // 世界観構築
  CHARACTER: 'CHARACTER',    // キャラクター設計
  GAME: 'GAME',              // ゲーム
  INTERACTIVE: 'INTERACTIVE' // インタラクティブ体験
} as const;

/**
 * カスタムタイプ定義
 */
// コンテンツ参照型
const contentReferenceTypeObject = a.customType({
  contentId: a.string(),
  relationType: a.enum(Object.values(ReferenceType))
});

// ストレージ参照型
const storageReferenceObject = a.customType({
  key: a.string(),
  fileName: a.string(),
  contentType: a.string(),
  size: a.integer()
});

// コラボレーター情報型
const collaboratorObject = a.customType({
  userId: a.string(),
  role: a.string(),
  permissions: a.string().array()
});

// 創作タスク期間型
const taskPeriodObject = a.customType({
  startDate: a.datetime(),
  endDate: a.datetime(),
  estimatedHours: a.float()
});

/**
 * スキーマ定義
 */
const schema = a.schema({
  /**
   * 区画A: サイト管理 - コンテンツモデル
   */
  // お知らせモデル
  Announcement: a.model({
    id: a.id(),
    title: a.string().required(),
    content: a.string().required(),
    category: a.enum(['IMPORTANT', 'SYSTEM', 'CONTENT', 'EVENT']).required(),
    isHighlighted: a.boolean().required(),
    publishedAt: a.datetime().required(),
    expiresAt: a.datetime(),
    createdAt: a.datetime(),
    updatedAt: a.datetime(),
    authorId: a.string().required()
  }).authorization(allow => [
    // 公開お知らせは誰でも閲覧可能
    allow.public().to(['read']),
    // 管理者のみが作成・編集可能
    allow.authenticated().to(['create']).when(context => 
      context.identity.claims.get('custom:userRole') === 'ADMIN'),
    allow.authenticated().to(['update', 'delete']).when(context => 
      context.identity.claims.get('custom:userRole') === 'ADMIN' || 
      context.identity.username === context.source.authorId)
  ]),
  
  // サイト統計モデル
  SiteAnalytics: a.model({
    id: a.id(),
    date: a.string().required(),
    pageViews: a.integer().required(),
    uniqueVisitors: a.integer().required(),
    topPages: a.json().required(),
    worldDistribution: a.json().required(),
    deviceStats: a.json().required(),
    createdAt: a.datetime(),
    updatedAt: a.datetime()
  }).authorization(allow => [
    // 管理者のみアクセス可能
    allow.authenticated().to(['read', 'create', 'update', 'delete']).when(context => 
      context.identity.claims.get('custom:userRole') === 'ADMIN')
  ]),
  
  /**
   * 区画B: Project Niferche - コンテンツモデル
   */
  // コンテンツモデル - メインストーリー、サイドストーリー、設定資料など
  NifercheContent: a.model({
    id: a.id(),
    title: a.string().required(),
    description: a.string().required(),
    content: a.string(), // マークダウンまたはHTML
    
    // 分類情報
    category: a.enum(Object.values(ContentCategory)).required(),
    worldType: a.enum(Object.values(WorldCategory)).required(),
    tags: a.string().array(),
    
    // 状態と可視性
    status: a.enum(Object.values(ContentStatus)).required(),
    visibility: a.enum(Object.values(Visibility)).required(),
    
    // 関連付け
    relatedContents: a.customType(contentReferenceTypeObject).array(),
    characterRefs: a.string().array(),
    
    // メタデータ
    createdAt: a.datetime(),
    updatedAt: a.datetime(),
    publishedAt: a.datetime(),
    version: a.integer().required(),
    
    // ストレージ参照
    mainImage: a.customType(storageReferenceObject),
    contentFiles: a.customType(storageReferenceObject).array(),
    
    // ユーザー参照
    authorId: a.string().required(),
    collaborators: a.customType(collaboratorObject).array(),
    
    // リレーション
    comments: a.hasMany('ContentComment')
  }).authorization(allow => [
    // 公開コンテンツは誰でも閲覧可能
    allow.public().to(['read']).when(content => 
      content.visibility === 'PUBLIC' && content.status === 'PUBLISHED'
    ),
    
    // 認証済みユーザーはPUBLICとAUTHENTICATEDを閲覧可能
    allow.authenticated().to(['read']).when(content => 
      (content.visibility === 'PUBLIC' || content.visibility === 'AUTHENTICATED') && 
      content.status === 'PUBLISHED'
    ),
    
    // 認証済みユーザーは新規作成可能
    allow.authenticated().to(['create']),
    
    // 所有者は自分のコンテンツを完全に管理可能
    allow.owner().to(['read', 'update', 'delete']),
    
    // 管理者は全て可能
    allow.authenticated().to(['read', 'update', 'delete']).when(context => 
      context.identity.claims.get('custom:userRole') === 'ADMIN' || 
      context.identity.claims.get('custom:userRole') === 'CONTENT_MANAGER'
    )
  ]),

  // 最小限の他のモデルを含む簡略版のスキーマ
  ContentComment: a.model({
    id: a.id(),
    contentId: a.string().required(),
    text: a.string().required(),
    authorId: a.string().required(),
    createdAt: a.datetime(),
    status: a.enum(['ACTIVE', 'HIDDEN', 'DELETED']).required(),
    
    // リレーション
    content: a.belongsTo('NifercheContent')
  }).authorization(allow => [
    // 公開コメントは誰でも閲覧可能
    allow.public().to(['read']).when(comment => 
      comment.status === 'ACTIVE'
    ),
    
    // 認証済みユーザーはコメント作成可能
    allow.authenticated().to(['create']),
    
    // 所有者は自分のコメントを管理可能
    allow.owner().to(['read', 'update', 'delete']),
    
    // 管理者はコメントを管理可能
    allow.authenticated().to(['read', 'update', 'delete']).when(context => 
      context.identity.claims.get('custom:userRole') === 'ADMIN' || 
      context.identity.claims.get('custom:userRole') === 'CONTENT_MANAGER'
    )
  ])
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
    apiKeyAuthorizationMode: {
      expiresInDays: 30
    }
  }
});