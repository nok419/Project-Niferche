// src/graphql/queries.ts
// モックGraphQLクエリ（テスト用）

// NifercheContent関連クエリ
export const getNifercheContent = /* GraphQL */ `query GetNifercheContent($id: ID!) {
  getNifercheContent(id: $id) {
    id
    title
    description
    content
    category
    worldType
    tags
    status
    visibility
    relatedContents {
      contentId
      relationType
    }
    characterRefs
    createdAt
    updatedAt
    publishedAt
    version
    mainImage {
      key
      fileName
      contentType
      size
    }
    contentFiles {
      key
      fileName
      contentType
      size
    }
    authorId
    collaborators {
      userId
      role
      permissions
    }
    comments {
      items {
        id
        contentId
        text
        authorId
        createdAt
        status
      }
      nextToken
    }
  }
}`;

export const listNifercheContents = /* GraphQL */ `query ListNifercheContents(
  $filter: ModelNifercheContentFilterInput
  $limit: Int
  $nextToken: String
) {
  listNifercheContents(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      title
      description
      category
      worldType
      tags
      status
      visibility
      mainImage {
        key
        fileName
        contentType
        size
      }
      createdAt
      updatedAt
      publishedAt
      version
      authorId
    }
    nextToken
  }
}`;

// CreativeProject関連クエリ
export const getCreativeProject = /* GraphQL */ `query GetCreativeProject($id: ID!) {
  getCreativeProject(id: $id) {
    id
    title
    description
    projectType
    lifecycleStatus
    visibility
    worldReference
    tags
    startDate
    targetDate
    completedDate
    createdAt
    updatedAt
    ownerId
    collaborators {
      userId
      role
      permissions
    }
    tasks {
      items {
        id
        projectId
        title
        description
        status
        priority
        assigneeId
        createdAt
        updatedAt
        completedAt
      }
      nextToken
    }
    milestones {
      items {
        id
        projectId
        title
        description
        targetDate
        status
        createdAt
        updatedAt
        reachedAt
      }
      nextToken
    }
    artifacts {
      items {
        id
        projectId
        taskId
        title
        description
        artifactType
        version
        tags
        createdAt
        updatedAt
        createdBy
      }
      nextToken
    }
  }
}`;

export const listCreativeProjects = /* GraphQL */ `query ListCreativeProjects(
  $filter: ModelCreativeProjectFilterInput
  $limit: Int
  $nextToken: String
) {
  listCreativeProjects(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      title
      description
      projectType
      lifecycleStatus
      visibility
      worldReference
      tags
      startDate
      targetDate
      completedDate
      createdAt
      updatedAt
      ownerId
    }
    nextToken
  }
}`;

// CreativeTask関連クエリ
export const listCreativeTasks = /* GraphQL */ `query ListCreativeTasks(
  $filter: ModelCreativeTaskFilterInput
  $limit: Int
  $nextToken: String
) {
  listCreativeTasks(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      projectId
      title
      description
      status
      priority
      assigneeId
      startDate
      dueDate
      completedDate
      createdAt
      updatedAt
    }
    nextToken
  }
}`;

// Announcement関連クエリ
export const listAnnouncements = /* GraphQL */ `query ListAnnouncements(
  $filter: ModelAnnouncementFilterInput
  $limit: Int
  $nextToken: String
) {
  listAnnouncements(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      title
      content
      category
      isHighlighted
      publishedAt
      expiresAt
      createdAt
      updatedAt
      authorId
    }
    nextToken
  }
}`;

// UserProfile関連クエリ
export const getUserProfile = /* GraphQL */ `query GetUserProfile($id: ID!) {
  getUserProfile(id: $id) {
    id
    userId
    nickname
    email
    bio
    avatarKey
    profileVisibility
    preferences
    lastLoginAt
    createdAt
    updatedAt
    role
    laboratoryRole
  }
}`;

// Character関連クエリ
export const getCharacter = /* GraphQL */ `query GetCharacter($id: ID!) {
  getCharacter(id: $id) {
    id
    name
    worldType
    description
    biography
    attributes
    relationships
    status
    visibility
    mainImage {
      key
      fileName
      contentType
      size
    }
    createdAt
    updatedAt
    authorId
  }
}`;

export const listCharacters = /* GraphQL */ `query ListCharacters(
  $filter: ModelCharacterFilterInput
  $limit: Int
  $nextToken: String
) {
  listCharacters(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      name
      worldType
      description
      status
      visibility
      mainImage {
        key
        fileName
        contentType
        size
      }
      createdAt
      updatedAt
      authorId
    }
    nextToken
  }
}`;