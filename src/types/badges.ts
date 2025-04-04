// src/types/badges.ts
import { ApiResponse } from './common';

// バッジ獲得条件タイプ
export enum BadgeRequirementType {
  LOGIN = 'LOGIN',
  READ_CONTENT = 'READ_CONTENT',
  VISIT_PAGE = 'VISIT_PAGE',
  CLICK_ACTION = 'CLICK_ACTION'
}

// バッジの型定義
export interface Badge {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  requirementType: BadgeRequirementType;
  requirement: string;
  priority: number;
  isSecret: boolean;
  createdAt: string;
  updatedAt: string;
}

// バッジの進捗状況の型定義
export interface BadgeProgress {
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

// バッジ通知用インターフェース
export interface BadgeNotification {
  badge: Badge;
  progress: BadgeProgress;
  isNew: boolean;
}

// APIから返されるバッジデータ
export interface ApiBadge {
  id: string;
  name: string;
  description: string;
  imageKey?: string;
  requirementType: BadgeRequirementType;
  requirement: string;
  priority: number;
  isSecret: boolean;
  createdAt: string;
  updatedAt?: string;
}

// APIレスポンス型
export type BadgeApiResponse = ApiResponse<ApiBadge[]>;
export type BadgeProgressApiResponse = ApiResponse<BadgeProgress[]>;

// バッジデータ変換関数
export function transformToBadge(data: ApiBadge): Badge {
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    iconUrl: data.imageKey ? `/images/badges/${data.imageKey}` : '/images/badges/default.png',
    requirementType: data.requirementType,
    requirement: data.requirement,
    priority: data.priority,
    isSecret: data.isSecret,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt || data.createdAt
  };
}

// バッジ進捗データ変換関数
export function transformToBadgeProgress(data: any): BadgeProgress {
  return {
    id: data.id,
    userId: data.userId,
    badgeId: data.badgeId,
    progress: data.progress,
    isCompleted: data.isCompleted,
    completedAt: data.completedAt || null,
    lastUpdatedAt: data.lastUpdatedAt,
    createdAt: data.createdAt || data.lastUpdatedAt,
    updatedAt: data.updatedAt || data.lastUpdatedAt
  };
}

// バッジヘルパー関数
export function getBadgeNotification(badge: Badge, progress: BadgeProgress, isNew: boolean = false): BadgeNotification {
  return {
    badge,
    progress,
    isNew
  };
}