// amplify/data/resource.tsx

import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  Content: a.model({
    // 基本情報
    title: a.string().required(),
    description: a.string(),
    attribution: a.enum(['NIFERCHE', 'LABORATORY', 'MATERIALS']).required(),
    contentType: a.enum(['NOVEL', 'IMAGE', 'AUDIO', 'SETTING']).required(),
    category: a.enum(['MAIN', 'SIDE', 'COMMON', 'UNIQUE']).required(),
    worldCategory: a.enum(['QUXE', 'HODEMEI', 'ALSAREJIA', 'COMMON']),
    status: a.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).required(),
    isOfficial: a.boolean().required(),
    version: a.integer().required(),
    
    // 検索・ソート用
    sortKey: a.string().required(), // [worldCategory]#[category]#[type]形式
    searchTags: a.string().array(),
    
    // パンくずリスト用
    pathSegments: a.customType({
      world: a.string(),
      category: a.string(),
      subcategory: a.string()
    }),

    // ストレージ情報
    storage: a.customType({
      s3Key: a.string().required(),
      versions: a.array(a.customType({
        versionId: a.string().required(),
        s3VersionId: a.string().required(),
        createdAt: a.string().required(),
        path: a.string().required()
      })),
      thumbnail: a.customType({
        s3Key: a.string(),
        width: a.integer(),
        height: a.integer()
      })
    }),

    // 関連情報
    references: a.customType({
      sourceIds: a.array(a.string()),
      relationTypes: a.array(a.string())
    }),
    visibility: a.enum(['PUBLIC', 'PRIVATE', 'LIMITED']).required(),
  })
  .authorization([
    a.allow.public().to(['read']),
    a.allow.owner().to(['create', 'update', 'delete']),
    a.allow.groups(['ADMIN']).to(['create', 'update', 'delete'])
  ])
  .index('byWorld', {
    sortKey: 'sortKey',
    queryField: 'contentsByWorld'
  })
  .index('byType', {
    sortKey: 'contentType',
    queryField: 'contentsByType'
  })
  .index('byOwner', {
    sortKey: 'createdAt',
    queryField: 'contentsByOwner'
  }),

  ContentRelationship: a.model({
    relationId: a.string().required(),
    relationType: a.string().required(),
    sourceId: a.string().array().required(),
    targetId: a.string().required(),
    category: a.enum(['STORY', 'SETTING', 'REFERENCE', 'DERIVATIVE']).required(),
    metadata: a.customType({
      description: a.string(),
      importance: a.integer(),
      createdAt: a.string().required(),
      updatedAt: a.string().required()
    })
  })
  .authorization([
    a.allow.public().to(['read']),
    a.allow.owner().to(['create', 'update', 'delete']),
    a.allow.groups(['ADMIN']).to(['create', 'update', 'delete'])
  ])
  .index('bySource', {
    sortKey: 'relationType',
    queryField: 'relationsBySource'
  })
  .index('byTarget', {
    sortKey: 'relationType',
    queryField: 'relationsByTarget'
  }),

  User: a.model({
    email: a.string().required(),
    role: a.enum(['ADMIN', 'MODERATOR', 'USER']).required(),
    profile: a.customType({
      displayName: a.string(),
      avatar: a.string(),
      biography: a.string()
    }),
    settings: a.customType({
      notifications: a.boolean(),
      privacy: a.string(),
      language: a.string()
    }),
    status: a.enum(['ACTIVE', 'SUSPENDED', 'DELETED']).required(),
    lastLogin: a.string(),
    contentCount: a.integer(),
    favoriteContents: a.string().array()
  })
  .authorization([
    a.allow.owner().to(['read', 'update']),
    a.allow.groups(['ADMIN']).to(['create', 'read', 'update', 'delete']),
    a.allow.public().to(['read'])
  ])
  .index('byRole', {
    sortKey: 'status',
    queryField: 'usersByRole'
  }),

  Feedback: a.model({
    contentId: a.string().required(),
    userId: a.string().required(),
    type: a.enum(['COMMENT', 'REVIEW', 'SUGGESTION']).required(),
    content: a.string().required(),
    status: a.enum(['ACTIVE', 'HIDDEN', 'DELETED']).required(),
    metadata: a.customType({
      edited: a.boolean(),
      editedAt: a.string(),
      replyTo: a.string(),
      likes: a.integer()
    }),
    rating: a.integer(),
    tags: a.string().array()
  })
  .authorization([
    a.allow.owner().to(['create', 'read', 'update', 'delete']),
    a.allow.public().to(['read']),
    a.allow.groups(['MODERATOR', 'ADMIN']).to(['update', 'delete'])
  ])
  .index('byContent', {
    sortKey: 'createdAt',
    queryField: 'feedbackByContent'
  })
  .index('byUser', {
    sortKey: 'createdAt',
    queryField: 'feedbackByUser'
  })
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
    apiKeyAuthorizationMode: { expiresInDays: 30 }
  }
});