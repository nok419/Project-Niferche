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


const schema = a.schema({
  Content: a.model({
    id: a.id(),
    title: a.string(),
    description: a.string(),

    // content type information
    primaryTypes: a.string().array(),  
    supplementaryTypes: a.string().array(),
    
    // classification information
    primaryCategory: a.enum(Object.values(ContentCategory)),
    secondaryCategories: a.string().array(),
    worldType: a.enum(Object.values(WorldCategory)),
    attribution: a.enum(Object.values(Attribution)),
    visibility: a.enum(Object.values(Visibility)),

    // status
    status: a.enum(Object.values(ContentStatus)),

    // metadata
    tags: a.string().array(),
    sourceRefs: a.customType({
      contentId: a.string(),
      relationType: a.enum(Object.values(ReferenceType))
    }),
    characterRefs: a.string().array(),
    itemRefs: a.string().array(),
    relatedContent: a.customType({
      contentId: a.string(),
      relationType: a.enum(Object.values(ReferenceType))
    }),
    createdAt: a.datetime(),
    updatedAt: a.datetime(),
    version: a.string(),

    // storage information
    mainKey: a.string(),
    thumbnailKey: a.string(),
    attachments: a.string().array(),

    // access control
    ownerId: a.string(),
    collaborators: a.string().array(),

  }).authorization(allow => [
    // 公開コンテンツは誰でも読める
    allow.publicApiKey().to(['read']),
    
    // 認証済みユーザーはCRUDが可能
    allow.authenticated().to(['create', 'read', 'update', 'delete']),

    // 所有者は全ての操作が可能
    allow.owner().to(['create', 'read', 'update', 'delete']),

    // 管理者は全ての操作が可能
    allow.group('admin').to(['create', 'read', 'update', 'delete'])
  ]),

  Comment: a.model({
    id: a.id(),
    contentId: a.string(),
    authorId: a.string(),
    text: a.string(),
    createdAt: a.datetime(),
    status: a.enum(['ACTIVE', 'HIDDEN', 'DELETED'])
  }).authorization(allow => [
    allow.publicApiKey().to(['read']),
    allow.owner().to(['create', 'update']),
    allow.group('admin').to(['delete'])
  ]),

  // ユーザープロファイルモデル
  UserProfile: a.model({
    id: a.id(),
    userId: a.string().required(),
    nickname: a.string(),
    email: a.string(),
    role: a.enum(['user', 'admin']),           // .required()を削除
    groups: a.string().array(),                 // groupsに修正
    badges: a.string().array().required(),
    favorites: a.customType({
      contentId: a.string().required(),
      addedAt: a.datetime().required(),
      contentType: a.string().required()
    }),
    profileVisibility: a.enum(['public', 'private']),
    lastLoginAt: a.datetime(),
    createdAt: a.datetime().required(),
    updatedAt: a.datetime().required()
  }).authorization(allow => [
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
    requirementType: a.enum(Object.values(BadgeRequirementType)),
    requirement: a.string().required(),
    createdAt: a.datetime().required(),
    priority: a.integer().required(),
    isSecret: a.boolean().required()
  }).authorization(allow => [
    allow.authenticated().to(['read']),
    allow.owner().to(['create', 'update', 'delete'])
  ]),

  // バッジ進捗モデル
  BadgeProgress: a.model({
    id: a.id(),
    userId: a.string().required(),
    badgeId: a.string().required(),
    progress: a.integer().required(),
    isCompleted: a.boolean().required(),
    completedAt: a.datetime(),
    lastUpdatedAt: a.datetime().required()
  }).authorization(allow => [
    allow.owner(),
    allow.authenticated().to(['read'])
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