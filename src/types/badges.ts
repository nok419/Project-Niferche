// /src/types/badges.ts
export enum BadgeRequirementType {
    LOGIN = 'LOGIN',
    READ_CONTENT = 'READ_CONTENT',
    VISIT_PAGE = 'VISIT_PAGE',
    CLICK_ACTION = 'CLICK_ACTION'
  }
  
  export interface Badge {
    id: string;
    name: string;
    description: string;
    iconUrl: string;
    condition: string;
    requirementType: BadgeRequirementType;
    requirement: string;
    createdAt: Date;
    priority: number;
    isSecret: boolean;
  }
  
  export interface UserBadgeProgress {
    id: string;
    userId: string;
    badgeId: string;
    progress: number;
    isCompleted: boolean;
    completedAt?: Date;
    lastUpdatedAt: Date;
  }