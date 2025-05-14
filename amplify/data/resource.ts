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
const contentReferenceTypeObject = {
  contentId: a.string(),
  relationType: a.enum(Object.values(ReferenceType))
};

// ストレージ参照型
const storageReferenceObject = {
  key: a.string(),
  fileName: a.string(),
  contentType: a.string(),
  size: a.integer().optional()
};

// コラボレーター情報型
const collaboratorObject = {
  userId: a.string(),
  role: a.string(),
  permissions: a.string().array()
};

// 創作タスク期間型
const taskPeriodObject = {
  startDate: a.datetime().optional(),
  endDate: a.datetime().optional(),
  estimatedHours: a.float().optional()
};

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
    title: a.string(),
    content: a.string(),
    category: a.enum(['IMPORTANT', 'SYSTEM', 'CONTENT', 'EVENT']),
    isHighlighted: a.boolean(),
    publishedAt: a.datetime(),
    expiresAt: a.datetime().optional(),
    createdAt: a.datetime(),
    updatedAt: a.datetime(),
    authorId: a.string()
  }).authorization((allow, _, { if: when }) => [
    // 公開お知らせは誰でも閲覧可能
    allow.publicApiKey().to(['read']),
    // 管理者のみが作成・編集可能
    allow.authenticated().to(['create']).if(ctx => 
      ctx.identity.claims['custom:userRole'].eq('ADMIN')),
    allow.authenticated().to(['update', 'delete']).if(ctx => 
      ctx.identity.claims['custom:userRole'].eq('ADMIN').or(
        ctx.identity.username.eq(a.identity().username)
      ))
  ]),
  
  // サイト統計モデル
  SiteAnalytics: a.model({
    id: a.id(),
    date: a.string(),
    pageViews: a.integer(),
    uniqueVisitors: a.integer(),
    topPages: a.json(),
    worldDistribution: a.json(),
    deviceStats: a.json(),
    createdAt: a.datetime(),
    updatedAt: a.datetime()
  }).authorization((allow, _, { if: when }) => [
    // 管理者のみアクセス可能
    allow.authenticated().to(['read', 'create', 'update', 'delete']).if(ctx => 
      ctx.identity.claims['custom:userRole'].eq('ADMIN'))
  ]),
  
  /**
   * 区画B: Project Niferche - コンテンツモデル
   */
  // コンテンツモデル - メインストーリー、サイドストーリー、設定資料など
  NifercheContent: a.model({
    id: a.id(),
    title: a.string(),
    description: a.string(),
    content: a.string().optional(), // マークダウンまたはHTML
    
    // 分類情報
    category: a.enum(Object.values(ContentCategory)),
    worldType: a.enum(Object.values(WorldCategory)),
    tags: a.string().array().optional(),
    
    // 状態と可視性
    status: a.enum(Object.values(ContentStatus)),
    visibility: a.enum(Object.values(Visibility)),
    
    // 関連付け
    relatedContents: a.customType(contentReferenceTypeObject).array().optional(),
    characterRefs: a.string().array().optional(),
    
    // メタデータ
    createdAt: a.datetime(),
    updatedAt: a.datetime(),
    publishedAt: a.datetime().optional(),
    version: a.integer(),
    
    // ストレージ参照
    mainImage: a.customType(storageReferenceObject).optional(),
    contentFiles: a.customType(storageReferenceObject).array().optional(),
    
    // ユーザー参照
    authorId: a.string(),
    collaborators: a.customType(collaboratorObject).array().optional(),
    
    // リレーション
    comments: a.hasMany('ContentComment')
  }).authorization((allow, _, { if: when }) => [
    // 公開コンテンツは誰でも閲覧可能
    allow.publicApiKey().to(['read']).if(content => 
      content.visibility.eq('PUBLIC').and(content.status.eq('PUBLISHED'))
    ),
    
    // 認証済みユーザーはPUBLICとAUTHENTICATEDを閲覧可能
    allow.authenticated().to(['read']).if(content => 
      content.visibility.eq('PUBLIC')
      .or(content.visibility.eq('AUTHENTICATED'))
      .and(content.status.eq('PUBLISHED'))
    ),
    
    // 認証済みユーザーは新規作成可能
    allow.authenticated().to(['create']),
    
    // 所有者は自分のコンテンツを完全に管理可能
    allow.owner().to(['read', 'update', 'delete']),
    
    // コラボレーターは編集可能
    allow.authenticated().to(['read', 'update']).if((content, ctx) => {
      const collaborators = content.collaborators || [];
      return collaborators.some(c => c.userId === ctx.identity.username);
    }),
    
    // 管理者は全て可能
    allow.authenticated().to(['create', 'read', 'update', 'delete']).if(ctx => 
      ctx.identity.claims['custom:userRole'].eq('ADMIN').or(
        ctx.identity.claims['custom:userRole'].eq('CONTENT_MANAGER')
      ))
  ]),
  
  // コメントモデル
  ContentComment: a.model({
    id: a.id(),
    contentId: a.string(),
    text: a.string(),
    authorId: a.string(),
    createdAt: a.datetime(),
    status: a.enum(['ACTIVE', 'HIDDEN', 'DELETED']),
    
    // リレーション
    content: a.belongsTo('NifercheContent')
  }).authorization((allow, _, { if: when }) => [
    // 公開コメントは誰でも閲覧可能
    allow.publicApiKey().to(['read']).if(comment => 
      comment.status.eq('ACTIVE')
    ),
    
    // 認証済みユーザーはコメント作成可能
    allow.authenticated().to(['create']),
    
    // 所有者は自分のコメントを管理可能
    allow.owner().to(['read', 'update', 'delete']),
    
    // 管理者はコメントを管理可能
    allow.authenticated().to(['read', 'update', 'delete']).if(ctx => 
      ctx.identity.claims['custom:userRole'].eq('ADMIN').or(
        ctx.identity.claims['custom:userRole'].eq('CONTENT_MANAGER')
      ))
  ]),
  
  // キャラクター情報モデル
  Character: a.model({
    id: a.id(),
    name: a.string(),
    worldType: a.enum(Object.values(WorldCategory)),
    description: a.string(),
    biography: a.string().optional(),
    attributes: a.json().optional(),
    relationships: a.json().optional(),
    status: a.enum(Object.values(ContentStatus)),
    visibility: a.enum(Object.values(Visibility)),
    mainImage: a.customType(storageReferenceObject).optional(),
    createdAt: a.datetime(),
    updatedAt: a.datetime(),
    authorId: a.string()
  }).authorization((allow, _, { if: when }) => [
    // 公開キャラクターは誰でも閲覧可能
    allow.publicApiKey().to(['read']).if(character => 
      character.visibility.eq('PUBLIC').and(character.status.eq('PUBLISHED'))
    ),
    
    // 認証済みユーザーはPUBLICとAUTHENTICATEDを閲覧可能
    allow.authenticated().to(['read']).if(character => 
      character.visibility.eq('PUBLIC')
      .or(character.visibility.eq('AUTHENTICATED'))
      .and(character.status.eq('PUBLISHED'))
    ),
    
    // 認証済みユーザーは新規作成可能
    allow.authenticated().to(['create']),
    
    // 所有者は自分のキャラクターを完全に管理可能
    allow.owner().to(['read', 'update', 'delete']),
    
    // 管理者は全て可能
    allow.authenticated().to(['create', 'read', 'update', 'delete']).if(ctx => 
      ctx.identity.claims['custom:userRole'].eq('ADMIN').or(
        ctx.identity.claims['custom:userRole'].eq('CONTENT_MANAGER')
      ))
  ]),
  
  /**
   * 区画C: Laboratory - 創作ライフサイクル管理モデル
   */
  // 創作プロジェクトモデル
  CreativeProject: a.model({
    id: a.id(),
    title: a.string(),
    description: a.string(),
    projectType: a.enum(Object.values(ProjectType)),
    lifecycleStatus: a.enum(Object.values(CreativeLifecycleStatus)),
    visibility: a.enum(Object.values(Visibility)),
    worldReference: a.enum(Object.values(WorldCategory)).optional(),
    tags: a.string().array().optional(),
    
    // 期間情報
    startDate: a.datetime().optional(),
    targetDate: a.datetime().optional(),
    completedDate: a.datetime().optional(),
    
    // メタデータ
    createdAt: a.datetime(),
    updatedAt: a.datetime(),
    
    // ユーザー参照
    ownerId: a.string(),
    collaborators: a.customType(collaboratorObject).array().optional(),
    
    // リレーション
    tasks: a.hasMany('CreativeTask'),
    milestones: a.hasMany('CreativeMilestone'),
    artifacts: a.hasMany('CreativeArtifact')
  }).authorization((allow, _, { if: when }) => [
    // 公開プロジェクトは誰でも閲覧可能
    allow.publicApiKey().to(['read']).if(project => 
      project.visibility.eq('PUBLIC')
    ),
    
    // 認証済みユーザーはPUBLICとAUTHENTICATEDを閲覧可能
    allow.authenticated().to(['read']).if(project => 
      project.visibility.eq('PUBLIC')
      .or(project.visibility.eq('AUTHENTICATED'))
    ),
    
    // Laboratoryユーザーは新規作成可能
    allow.authenticated().to(['create']).if(ctx => 
      ctx.identity.claims['custom:laboratoryRole'].exists()
    ),
    
    // 所有者は自分のプロジェクトを完全に管理可能
    allow.owner().to(['read', 'update', 'delete']),
    
    // コラボレーターは編集可能
    allow.authenticated().to(['read', 'update']).if((project, ctx) => {
      const collaborators = project.collaborators || [];
      return collaborators.some(c => c.userId === ctx.identity.username);
    }),
    
    // Laboratory管理者は全て可能
    allow.authenticated().to(['create', 'read', 'update', 'delete']).if(ctx => 
      ctx.identity.claims['custom:laboratoryRole'].eq('ADMIN'))
  ]),
  
  // 創作タスクモデル
  CreativeTask: a.model({
    id: a.id(),
    projectId: a.string(),
    title: a.string(),
    description: a.string(),
    status: a.enum(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED', 'CANCELLED']),
    priority: a.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
    
    // 期間情報
    period: a.customType(taskPeriodObject),
    
    // リレーション
    assigneeId: a.string().optional(),
    dependsOn: a.string().array().optional(),
    milestoneId: a.string().optional(),
    
    // メタデータ
    createdAt: a.datetime(),
    updatedAt: a.datetime(),
    completedAt: a.datetime().optional(),
    
    // リレーション
    project: a.belongsTo('CreativeProject'),
    milestone: a.belongsTo('CreativeMilestone').optional(),
    artifacts: a.hasMany('CreativeArtifact')
  }).authorization((allow, _, { if: when }) => [
    // プロジェクトの権限を継承
    allow.publicApiKey().to(['read']).if(task => 
      task.project.visibility.eq('PUBLIC')
    ),
    
    allow.authenticated().to(['read']).if(task => 
      task.project.visibility.eq('PUBLIC')
      .or(task.project.visibility.eq('AUTHENTICATED'))
    ),
    
    // プロジェクト所有者とコラボレーターは編集可能
    allow.owner('project.ownerId').to(['create', 'read', 'update', 'delete']),
    
    // 担当者は更新可能
    allow.authenticated().to(['read', 'update']).if((task, ctx) => 
      task.assigneeId.eq(ctx.identity.username)
    ),
    
    // Laboratory管理者は全て可能
    allow.authenticated().to(['create', 'read', 'update', 'delete']).if(ctx => 
      ctx.identity.claims['custom:laboratoryRole'].eq('ADMIN'))
  ]),
  
  // 創作マイルストーンモデル
  CreativeMilestone: a.model({
    id: a.id(),
    projectId: a.string(),
    title: a.string(),
    description: a.string(),
    targetDate: a.datetime(),
    status: a.enum(['PENDING', 'REACHED', 'MISSED', 'RESCHEDULED']),
    
    // メタデータ
    createdAt: a.datetime(),
    updatedAt: a.datetime(),
    reachedAt: a.datetime().optional(),
    
    // リレーション
    project: a.belongsTo('CreativeProject'),
    tasks: a.hasMany('CreativeTask')
  }).authorization((allow, _, { if: when }) => [
    // プロジェクトの権限を継承
    allow.publicApiKey().to(['read']).if(milestone => 
      milestone.project.visibility.eq('PUBLIC')
    ),
    
    allow.authenticated().to(['read']).if(milestone => 
      milestone.project.visibility.eq('PUBLIC')
      .or(milestone.project.visibility.eq('AUTHENTICATED'))
    ),
    
    // プロジェクト所有者とコラボレーターは編集可能
    allow.owner('project.ownerId').to(['create', 'read', 'update', 'delete']),
    
    // Laboratory管理者は全て可能
    allow.authenticated().to(['create', 'read', 'update', 'delete']).if(ctx => 
      ctx.identity.claims['custom:laboratoryRole'].eq('ADMIN'))
  ]),
  
  // 創作成果物モデル
  CreativeArtifact: a.model({
    id: a.id(),
    projectId: a.string(),
    taskId: a.string().optional(),
    title: a.string(),
    description: a.string(),
    artifactType: a.enum(Object.values(CreativeArtifactType)),
    
    // 成果物ファイル
    storageReferences: a.customType(storageReferenceObject).array(),
    thumbnailReference: a.customType(storageReferenceObject).optional(),
    
    // メタデータ
    version: a.integer(),
    tags: a.string().array().optional(),
    createdAt: a.datetime(),
    updatedAt: a.datetime(),
    createdBy: a.string(),
    
    // リレーション
    project: a.belongsTo('CreativeProject'),
    task: a.belongsTo('CreativeTask').optional()
  }).authorization((allow, _, { if: when }) => [
    // プロジェクトの権限を継承
    allow.publicApiKey().to(['read']).if(artifact => 
      artifact.project.visibility.eq('PUBLIC')
    ),
    
    allow.authenticated().to(['read']).if(artifact => 
      artifact.project.visibility.eq('PUBLIC')
      .or(artifact.project.visibility.eq('AUTHENTICATED'))
    ),
    
    // 作成者とプロジェクト所有者は編集可能
    allow.owner('createdBy').to(['read', 'update', 'delete']),
    allow.owner('project.ownerId').to(['read', 'update', 'delete']),
    
    // 認証済みユーザーは作成可能（タスク担当者）
    allow.authenticated().to(['create']),
    
    // Laboratory管理者は全て可能
    allow.authenticated().to(['create', 'read', 'update', 'delete']).if(ctx => 
      ctx.identity.claims['custom:laboratoryRole'].eq('ADMIN'))
  ]),
  
  /**
   * 共通モデル
   */
  // ユーザープロフィールモデル
  UserProfile: a.model({
    id: a.id(),
    userId: a.string(),
    nickname: a.string(),
    email: a.string(),
    bio: a.string().optional(),
    avatarKey: a.string().optional(),
    profileVisibility: a.enum(['PUBLIC', 'PRIVATE']),
    preferences: a.json().optional(),
    lastLoginAt: a.datetime(),
    createdAt: a.datetime(),
    updatedAt: a.datetime(),
    
    // ユーザーロール
    role: a.enum(['USER', 'CONTENT_CREATOR', 'CONTENT_MANAGER', 'ADMIN']),
    laboratoryRole: a.enum(['USER', 'RESEARCHER', 'ADMIN']).optional()
  }).authorization((allow, _, { if: when }) => [
    // 公開プロフィールは誰でも閲覧可能
    allow.publicApiKey().to(['read']).if(profile => 
      profile.profileVisibility.eq('PUBLIC')
    ),
    
    // 認証済みユーザーは閲覧可能
    allow.authenticated().to(['read']),
    
    // 所有者は自分のプロフィールを管理可能
    allow.owner('userId').to(['read', 'update']),
    
    // 管理者はプロフィールを管理可能
    allow.authenticated().to(['create', 'read', 'update', 'delete']).if(ctx => 
      ctx.identity.claims['custom:userRole'].eq('ADMIN'))
  ]),
  
  // ユーザーアクティビティモデル
  UserActivity: a.model({
    id: a.id(),
    userId: a.string(),
    activityType: a.enum(['LOGIN', 'CONTENT_VIEW', 'CONTENT_CREATE', 'CONTENT_UPDATE', 'COMMENT', 'REACTION']),
    resourceId: a.string().optional(),
    resourceType: a.string().optional(),
    metadata: a.json().optional(),
    createdAt: a.datetime()
  }).authorization((allow, _, { if: when }) => [
    // 所有者は自分のアクティビティを閲覧可能
    allow.owner('userId').to(['read']),
    
    // 認証済みユーザーは作成可能
    allow.authenticated().to(['create']),
    
    // 管理者はアクティビティを管理可能
    allow.authenticated().to(['read', 'delete']).if(ctx => 
      ctx.identity.claims['custom:userRole'].eq('ADMIN'))
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