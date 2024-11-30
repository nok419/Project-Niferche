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
    .authorization([
      { type: 'Public', operations: ['read'] },
      { type: 'Owner', operations: ['read', 'update'] },
      {
        type: 'Custom',
        operations: ['create', 'update', 'delete'],
        condition: { roleEquals: 'ADMIN' }
      }
    ])
    .index(['email']),

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
      })
    })
    .authorization([
      { type: 'Public', operations: ['read'] },
      { type: 'Owner', operations: ['create', 'read', 'update'] },
      {
        type: 'Custom',
        operations: ['delete', 'update'],
        condition: { roleEquals: 'ADMIN' }
      }
    ])
    .index(['contentId', 'userId'])
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