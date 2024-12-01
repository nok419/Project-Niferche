import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const ContentTypes = ['NOVEL', 'IMAGE', 'AUDIO', 'VIDEO', 'MERCHANDISE', 'SETTING', 'THEORY'] as const;
const ContentCategories = ['MAIN_STORY', 'SIDE_STORY', 'SETTING_MATERIAL', 'GALLERY', 'SHOP', 'THEORY_DOCUMENT'] as const;
const WorldCategories = ['COMMON', 'QUXE', 'HODEMEI', 'ALSAREJIA'] as const;
const Attributions = ['OFFICIAL', 'SHARED'] as const;
const Visibilities = ['PUBLIC', 'RESTRICTED', 'PRIVATE'] as const;
const ReferenceTypes = ['BASED_ON', 'INSPIRED_BY', 'EXTENDS', 'REFERENCES', 'VERSION_OF'] as const;
const StatusTypes = ['DRAFT', 'PUBLISHED', 'ARCHIVED'] as const;

const schema = a.schema({
  Content: a.model({
    id: a.id(),
    type: a.enum(ContentTypes),
    category: a.enum(ContentCategories),
    world: a.enum(WorldCategories),
    attribution: a.enum(Attributions),
    visibility: a.enum(Visibilities),
    status: a.enum(StatusTypes),
    title: a.string(),
    description: a.string(),
    tags: a.string().array(),
    s3Key: a.string(),
    versions: a.string().array(),
    ownerId: a.string(),
    createdAt: a.datetime(),
    updatedAt: a.datetime(),
    metadata: a.string()
  })
  .authorization(allow => [
    allow.public().to(['read']),
    allow.owner().to(['read', 'update', 'delete']),
    allow.authenticated().to(['create'])
  ]),

  ContentReference: a.model({
    id: a.id(),
    sourceId: a.string(),
    targetId: a.string(),
    referenceType: a.enum(ReferenceTypes),
    strength: a.integer(),
    description: a.string(),
    metadata: a.string()
  })
  .authorization(allow => [
    allow.public().to(['read']),
    allow.authenticated().to(['create']),
    allow.owner().to(['update', 'delete'])
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