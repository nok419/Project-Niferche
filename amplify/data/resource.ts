// File: amplify/data/resource.ts
import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const ContentCategory = {
  MAIN_STORY: 'MAIN_STORY',
  SIDE_STORY: 'SIDE_STORY',
  SETTING_MATERIAL: 'SETTING_MATERIAL',
  CHARACTER: 'CHARACTER',
  ORGANIZATION: 'ORGANIZATION',
  THEORY: 'THEORY',
  MERCHANDISE: 'MERCHANDISE',
  SITE_INFO: 'SITE_INFO'
} as const;

const WorldCategory = {
  COMMON: 'COMMON',
  QUXE: 'QUXE',
  HODEMEI: 'HODEMEI',
  ALSAREJIA: 'ALSAREJIA'
} as const;

const Attribution = {
  OFFICIAL: 'OFFICIAL',
  SHARED: 'SHARED'
} as const;

const Visibility = {
  PUBLIC: 'PUBLIC',
  AUTHENTICATED: 'AUTHENTICATED',
  PRIVATE: 'PRIVATE'
} as const;

const ReferenceType = {
  BASED_ON: 'BASED_ON',
  INSPIRED_BY: 'INSPIRED_BY',
  EXTENDS: 'EXTENDS',
  RELATED: 'RELATED'
} as const;

const ContentStatus = {
  DRAFT: 'DRAFT',
  REVIEW: 'REVIEW',
  PUBLISHED: 'PUBLISHED',
  ARCHIVED: 'ARCHIVED'
} as const;


// バッジ関連
const BadgeRequirementType = {
  LOGIN: 'LOGIN',
  READ_CONTENT: 'READ_CONTENT',
  VISIT_PAGE: 'VISIT_PAGE',
  CLICK_ACTION: 'CLICK_ACTION'
} as const;

// リファレンスタイプの定義
const contentReferenceType = a.customType({
  contentId: a.string().required(),
  relationType: a.enum(Object.values(ReferenceType)).required()
});

// お気に入りタイプの定義
const favoriteType = a.customType({
  contentId: a.string().required(),
  addedAt: a.datetime().required(),
  contentType: a.string().required()
});

const schema = a.schema({
  Content: a.model({
    id: a.id(),
    title: a.string().required(),
    description: a.string().required(),

    // content type information
    primaryTypes: a.string().array().required(),  
    supplementaryTypes: a.string().array(),
    
    // classification information
    primaryCategory: a.enum(Object.values(ContentCategory)).required(),
    secondaryCategories: a.string().array(),
    worldType: a.enum(Object.values(WorldCategory)).required(),
    attribution: a.enum(Object.values(Attribution)).required(),
    visibility: a.enum(Object.values(Visibility)).required(),

    // status
    status: a.enum(Object.values(ContentStatus)).required(),

    // metadata
    tags: a.string().array(),
    sourceRefs: contentReferenceType.array(),
    characterRefs: a.string().array(),
    itemRefs: a.string().array(),
    relatedContent: contentReferenceType.array(),
    createdAt: a.datetime().required(),
    updatedAt: a.datetime().required(),
    version: a.string().required(),

    // storage information
    mainKey: a.string().required(),
    thumbnailKey: a.string(),
    attachments: a.string().array(),

    // access control
    ownerId: a.string().required(),
    collaborators: a.string().array(),

    // relations
    comments: a.hasMany('Comment')

  }).authorization(allow => [
    // 公開コンテンツは誰でも読める (visibilityがPUBLICの場合のみ)
    allow.publicApiKey().to(['read']).when(content => content.visibility.eq('PUBLIC')),
    
    // 認証済みユーザーはPUBLICとAUTHENTICATEDの読み取りが可能
    allow.authenticated().to(['read']).when(content => 
      content.visibility.eq('PUBLIC')
      .or(content.visibility.eq('AUTHENTICATED'))
    ),
    
    // 認証済みユーザーは新規作成可能
    allow.authenticated().to(['create']),
    
    // 所有者は全ての操作が可能
    allow.owner().to(['read', 'update', 'delete']),
    
    // コラボレーターはコンテンツの読み取りと更新が可能
    allow.authenticated().to(['read', 'update']).when(content =>
      content.collaborators.includes(a.identity().username)
    ),

    // 管理者は全ての操作が可能
    allow.groups(['admin']).to(['create', 'read', 'update', 'delete'])
  ]),

  Comment: a.model({
    id: a.id(),
    contentId: a.string().required(),
    authorId: a.string().required(),
    text: a.string().required(),
    createdAt: a.datetime().required(),
    status: a.enum(['ACTIVE', 'HIDDEN', 'DELETED']).required(),
    
    // relations
    content: a.belongsTo('Content')
  }).authorization(allow => [
    // 公開コメントの読み取り (statusがACTIVEの場合のみ)
    allow.publicApiKey().to(['read']).when(comment => comment.status.eq('ACTIVE')),
    
    // 認証済みユーザーはコメントの作成が可能
    allow.authenticated().to(['create']),
    
    // 所有者は自分のコメントの更新と削除が可能
    allow.owner().to(['update', 'delete']),
    
    // 管理者はコメントの管理が可能
    allow.groups(['admin']).to(['read', 'update', 'delete'])
  ]),

  // ユーザープロファイルモデル
  UserProfile: a.model({
    id: a.id(),
    userId: a.string().required(),
    nickname: a.string().required(),
    email: a.string().required(),
    role: a.enum(['user', 'admin']).required(),
    groups: a.string().array(),
    badges: a.string().array(),
    favorites: favoriteType.array(),
    profileVisibility: a.enum(['public', 'private']).required(),
    lastLoginAt: a.datetime(),
    createdAt: a.datetime().required(),
    updatedAt: a.datetime().required(),
    
    // 関連データ
    badgeProgress: a.hasMany('BadgeProgress')
  }).authorization(allow => [
    // 公開プロファイルは誰でも読める
    allow.publicApiKey().to(['read']).when(profile => profile.profileVisibility.eq('public')),
    
    // 認証済みユーザーは閲覧可能
    allow.authenticated().to(['read']),
    
    // 所有者は全ての操作が可能
    allow.owner().to(['create', 'read', 'update', 'delete']),
    
    // admin グループのユーザーは全ての操作が可能
    allow.groups(['admin']).to(['create', 'read', 'update', 'delete'])
  ]),

  // バッジモデル
  Badge: a.model({
    id: a.id(),
    name: a.string().required(),
    description: a.string().required(),
    imageKey: a.string(),
    requirementType: a.enum(Object.values(BadgeRequirementType)).required(),
    requirement: a.string().required(),
    createdAt: a.datetime().required(),
    priority: a.integer().required(),
    isSecret: a.boolean().required(),
    
    // 関連データ
    progress: a.hasMany('BadgeProgress')
  }).authorization(allow => [
    // バッジ情報の読み取り
    allow.authenticated().to(['read']),
    
    // 管理者のみがバッジを管理できる
    allow.groups(['admin']).to(['create', 'update', 'delete'])
  ]),

  // バッジ進捗モデル
  BadgeProgress: a.model({
    id: a.id(),
    userId: a.string().required(),
    badgeId: a.string().required(),
    progress: a.integer().required(),
    isCompleted: a.boolean().required(),
    completedAt: a.datetime(),
    lastUpdatedAt: a.datetime().required(),
    
    // 関連データ
    user: a.belongsTo('UserProfile'),
    badge: a.belongsTo('Badge')
  }).authorization(allow => [
    // 所有者のみが自分の進捗を見られる
    allow.owner().to(['read']),
    
    // 認証済みシステムがバッジ進捗を更新できる
    allow.authenticated().to(['create', 'update']),
    
    // 管理者はバッジ進捗を管理できる
    allow.groups(['admin']).to(['read', 'update', 'delete'])
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
