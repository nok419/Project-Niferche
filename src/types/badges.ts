// File: src/types/badges.ts
export enum BadgeRequirementType {
  LOGIN = 'LOGIN',
  READ_CONTENT = 'READ_CONTENT',
  VISIT_PAGE = 'VISIT_PAGE',
  CLICK_ACTION = 'CLICK_ACTION'
}

export interface Badge {
  id: string | null;
  name: string;
  description: string;
  iconUrl: string;
  condition: string;
  requirementType: BadgeRequirementType;
  requirement: string;
  priority: number;
  isSecret: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserBadgeProgress {
  id: string;
  userId: string;
  badgeId: string;
  progress: number;
  isCompleted: boolean;
  completedAt: string | null;
  lastUpdatedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface BadgeNotification {
  badge: Badge;
  progress: UserBadgeProgress;
  isNew: boolean;
}