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
const contentReferenceTypeObject = {
  contentId: a.string(),
  relationType: a.enum(Object.values(ReferenceType))
};

// お気に入りタイプの定義
const favoriteTypeObject = {
  contentId: a.string(),
  addedAt: a.datetime(),
  contentType: a.string()
};

const schema = a.schema({
  Content: a.model({
    id: a.id(),
    title: a.string(),
    description: a.string(),

    // content type information
    primaryTypes: a.string().array(),  
    supplementaryTypes: a.string().array().optional(),
    
    // classification information
    primaryCategory: a.enum(Object.values(ContentCategory)),
    secondaryCategories: a.string().array().optional(),
    worldType: a.enum(Object.values(WorldCategory)),
    attribution: a.enum(Object.values(Attribution)),
    visibility: a.enum(Object.values(Visibility)),

    // status
    status: a.enum(Object.values(ContentStatus)),

    // metadata
    tags: a.string().array().optional(),
    sourceRefs: a.customType(contentReferenceTypeObject).array().optional(),
    characterRefs: a.string().array().optional(),
    itemRefs: a.string().array().optional(),
    relatedContent: a.customType(contentReferenceTypeObject).array().optional(),
    createdAt: a.datetime(),
    updatedAt: a.datetime(),
    version: a.string(),

    // storage information
    mainKey: a.string(),
    thumbnailKey: a.string().optional(),
    attachments: a.string().array().optional(),

    // access control
    ownerId: a.string(),
    collaborators: a.string().array().optional(),

    // relations
    comments: a.hasMany('Comment', 'content')

  }).authorization((allow, _, { if: when }) => [
    // 公開コンテンツは誰でも読める (visibilityがPUBLICの場合のみ)
    allow.publicApiKey().to(['read']).if(content => content.visibility.eq('PUBLIC')),
    
    // 認証済みユーザーはPUBLICとAUTHENTICATEDの読み取りが可能
    allow.authenticated().to(['read']).if(content => 
      content.visibility.eq('PUBLIC')
      .or(content.visibility.eq('AUTHENTICATED'))
    ),
    
    // 認証済みユーザーは新規作成可能
    allow.authenticated().to(['create']),
    
    // 所有者は全ての操作が可能
    allow.owner().to(['read', 'update', 'delete']),
    
    // コラボレーターはコンテンツの読み取りと更新が可能
    allow.authenticated().to(['read', 'update']).if(content =>
      content.collaborators.includes(a.identity().username)
    ),

    // 管理者は全ての操作が可能
    allow.groups(['admin']).to(['create', 'read', 'update', 'delete'])
  ]),

  Comment: a.model({
    id: a.id(),
    contentId: a.string(),
    authorId: a.string(),
    text: a.string(),
    createdAt: a.datetime(),
    status: a.enum(['ACTIVE', 'HIDDEN', 'DELETED']),
    
    // relations
    content: a.belongsTo('Content', 'comments')
  }).authorization((allow, _, { if: when }) => [
    // 公開コメントの読み取り (statusがACTIVEの場合のみ)
    allow.publicApiKey().to(['read']).if(comment => comment.status.eq('ACTIVE')),
    
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
    userId: a.string(),
    nickname: a.string(),
    email: a.string(),
    role: a.enum(['user', 'admin']),
    groups: a.string().array().optional(),
    badges: a.string().array().optional(),
    favorites: a.customType(favoriteTypeObject).array().optional(),
    profileVisibility: a.enum(['public', 'private']),
    lastLoginAt: a.datetime().optional(),
    createdAt: a.datetime(),
    updatedAt: a.datetime(),
    
    // 関連データ
    badgeProgress: a.hasMany('BadgeProgress', 'user')
  }).authorization((allow, _, { if: when }) => [
    // 公開プロファイルは誰でも読める
    allow.publicApiKey().to(['read']).if(profile => profile.profileVisibility.eq('public')),
    
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
    name: a.string(),
    description: a.string(),
    imageKey: a.string().optional(),
    requirementType: a.enum(Object.values(BadgeRequirementType)),
    requirement: a.string(),
    createdAt: a.datetime(),
    priority: a.integer(),
    isSecret: a.boolean(),
    
    // 関連データ
    progress: a.hasMany('BadgeProgress', 'badge')
  }).authorization(allow => [
    // バッジ情報の読み取り
    allow.authenticated().to(['read']),
    
    // 管理者のみがバッジを管理できる
    allow.groups(['admin']).to(['create', 'update', 'delete'])
  ]),

  // バッジ進捗モデル
  BadgeProgress: a.model({
    id: a.id(),
    userId: a.string(),
    badgeId: a.string(),
    progress: a.integer(),
    isCompleted: a.boolean(),
    completedAt: a.datetime().optional(),
    lastUpdatedAt: a.datetime(),
    
    // 関連データ
    user: a.belongsTo('UserProfile', 'badgeProgress'),
    badge: a.belongsTo('Badge', 'progress')
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