import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

// Enumの定義
const UserRole = {
  ADMIN: 'ADMIN',
  USER: 'USER'
} as const;

const UserStatus = {
  ACTIVE: 'ACTIVE',
  SUSPENDED: 'SUSPENDED',
  DELETED: 'DELETED'
} as const;

const FeedbackType = {
  COMMENT: 'COMMENT',
  REVIEW: 'REVIEW',
  SUGGESTION: 'SUGGESTION'
} as const;

const FeedbackStatus = {
  ACTIVE: 'ACTIVE',
  HIDDEN: 'HIDDEN',
  DELETED: 'DELETED'
} as const;

const schema = a.schema({
  User: a
    .model({
      email: a.string().required(),
      role: a.enum(Object.values(UserRole)),
      profile: a.customType({
        displayName: a.string(),
        avatar: a.string(),
        biography: a.string()
      }),
      status: a.enum(Object.values(UserStatus)),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
      lastLoginAt: a.datetime(),
      favoriteContents: a.string().array()
    })
    .authorization((allow) => [
      allow.public().to(['read']),
      allow.owner().to(['read', 'update']),
      allow.custom()
        .to(['create', 'update', 'delete'])
        .when(ctx => ctx.arguments.role === UserRole.ADMIN)
    ])
    .secondaryIndexes((idx) => ({
      byEmail: idx.sortKey('email')
    })),

  Feedback: a
    .model({
      contentId: a.string().required(),
      userId: a.string().required(),
      type: a.enum(Object.values(FeedbackType)),
      content: a.string().required(),
      status: a.enum(Object.values(FeedbackStatus)),
      metadata: a.customType({
        rating: a.integer(),
        tags: a.string().array()
      }),
      rating: a.integer(),
      tags: a.string().array()
    })
    .authorization((allow) => [
      allow.public().to(['read']),
      allow.owner().to(['create', 'read', 'update']),
      allow.custom()
        .to(['delete', 'update'])
        .when(ctx => ctx.arguments.role === UserRole.ADMIN)
    ])
    .secondaryIndexes((idx) => ({
      byContent: idx.sortKey('contentId'),
      byUser: idx.sortKey('userId')
    }))
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
    // API Key is used for public access
    apiKeyAuthorizationMode: {
      expiresInDays: 30
    }
  }
});