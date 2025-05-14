// src/graphql/mutations.ts
// âÃ¯GraphQLßåüÆü·çóÆ¹È(	

// NifercheContent¢#ßåüÆü·çó
export const createNifercheContent = /* GraphQL */ `mutation CreateNifercheContent($input: CreateNifercheContentInput!) {
  createNifercheContent(input: $input) {
    id
    title
    description
    content
    category
    worldType
    tags
    status
    visibility
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
    authorId
  }
}`;

export const updateNifercheContent = /* GraphQL */ `mutation UpdateNifercheContent($input: UpdateNifercheContentInput!) {
  updateNifercheContent(input: $input) {
    id
    title
    description
    content
    category
    worldType
    tags
    status
    visibility
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
    authorId
  }
}`;

export const deleteNifercheContent = /* GraphQL */ `mutation DeleteNifercheContent($input: DeleteNifercheContentInput!) {
  deleteNifercheContent(input: $input) {
    id
  }
}`;

// CreativeProject¢#ßåüÆü·çó
export const createCreativeProject = /* GraphQL */ `mutation CreateCreativeProject($input: CreateCreativeProjectInput!) {
  createCreativeProject(input: $input) {
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
}`;

export const updateCreativeProject = /* GraphQL */ `mutation UpdateCreativeProject($input: UpdateCreativeProjectInput!) {
  updateCreativeProject(input: $input) {
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
}`;

export const deleteCreativeProject = /* GraphQL */ `mutation DeleteCreativeProject($input: DeleteCreativeProjectInput!) {
  deleteCreativeProject(input: $input) {
    id
  }
}`;

// CreativeTask¢#ßåüÆü·çó
export const createCreativeTask = /* GraphQL */ `mutation CreateCreativeTask($input: CreateCreativeTaskInput!) {
  createCreativeTask(input: $input) {
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
}`;

export const updateCreativeTask = /* GraphQL */ `mutation UpdateCreativeTask($input: UpdateCreativeTaskInput!) {
  updateCreativeTask(input: $input) {
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
}`;

// Announcement¢#ßåüÆü·çó
export const createAnnouncement = /* GraphQL */ `mutation CreateAnnouncement($input: CreateAnnouncementInput!) {
  createAnnouncement(input: $input) {
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
}`;

export const updateAnnouncement = /* GraphQL */ `mutation UpdateAnnouncement($input: UpdateAnnouncementInput!) {
  updateAnnouncement(input: $input) {
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
}`;

// UserProfile¢#ßåüÆü·çó
export const updateUserProfile = /* GraphQL */ `mutation UpdateUserProfile($input: UpdateUserProfileInput!) {
  updateUserProfile(input: $input) {
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

// CreativeArtifact¢#ßåüÆü·çó
export const createCreativeArtifact = /* GraphQL */ `mutation CreateCreativeArtifact($input: CreateCreativeArtifactInput!) {
  createCreativeArtifact(input: $input) {
    id
    projectId
    taskId
    title
    description
    artifactType
    storageReferences {
      key
      fileName
      contentType
      size
    }
    thumbnailReference {
      key
      fileName
      contentType
      size
    }
    version
    tags
    createdAt
    updatedAt
    createdBy
  }
}`;

// ContentComment¢#ßåüÆü·çó
export const createContentComment = /* GraphQL */ `mutation CreateContentComment($input: CreateContentCommentInput!) {
  createContentComment(input: $input) {
    id
    contentId
    text
    authorId
    createdAt
    status
  }
}`;