// src/types/auth.ts
import { UserAttributeKey } from 'aws-amplify/auth';
import { ContentVisibility } from './common';

// アクセスレベルの再定義
export enum AccessLevel {
  PUBLIC = 'PUBLIC',             // 誰でも閲覧可能
  AUTHENTICATED = 'AUTHENTICATED', // ログインユーザーのみ閲覧可能
  OWNER_PUBLIC = 'OWNER_PUBLIC', // 所有者のみ編集可能、他ユーザーは閲覧可能
  OWNER_PRIVATE = 'OWNER_PRIVATE', // 所有者のみアクセス可能
  ADMIN = 'ADMIN'               // 管理者のみアクセス可能
}

// ContentVisibilityからAccessLevelへのマッピング
export function mapVisibilityToAccessLevel(visibility: ContentVisibility): AccessLevel {
  switch (visibility) {
    case ContentVisibility.PUBLIC:
      return AccessLevel.PUBLIC;
    case ContentVisibility.AUTHENTICATED:
      return AccessLevel.AUTHENTICATED;
    case ContentVisibility.PRIVATE:
      return AccessLevel.OWNER_PRIVATE;
    default:
      return AccessLevel.PUBLIC;
  }
}

// ユーザーロールの型定義
export type UserRole = 'user' | 'admin';

// 認証済みユーザー情報の型定義
export interface AuthUser {
  userId: string;
  username: string;
  role: UserRole;
  email?: string;
  nickname?: string;
  attributes?: {
    [key in UserAttributeKey]?: string;
  };
}

// セッションコンテキストで使用するユーザー型
export interface SessionUser {
  username: string;
  attributes?: Record<string, string>;
  userId?: string;
}

// アクセス制御関連型
export interface AccessItem {
  id: string;
  accessLevel: AccessLevel;
  ownerId?: string;
}

// 認証エラー型
export interface AuthError extends Error {
  code?: string;
  name: string;
}

// 認証操作の結果型
export interface AuthResult<T> {
  success: boolean;
  data?: T;
  error?: AuthError;
}

// ユーザーロール取得関数
export function getUserRole(user?: SessionUser): UserRole {
  return (user?.attributes?.['custom:role'] as UserRole) || 'user';
}

// アクセス権限チェック関数
export function hasAccess(user: SessionUser | undefined, item: AccessItem): boolean {
  if (!user) {
    return item.accessLevel === AccessLevel.PUBLIC;
  }

  const userRole = getUserRole(user);
  
  // 管理者は常にアクセス権限を持つ
  if (userRole === 'admin') {
    return true;
  }

  // 所有者チェック
  const isOwner = item.ownerId === user.userId || item.ownerId === user.username;

  switch (item.accessLevel) {
    case AccessLevel.PUBLIC:
      return true;
    case AccessLevel.AUTHENTICATED:
      return true;
    case AccessLevel.OWNER_PUBLIC:
      return isOwner || true; // 読み取りは全ユーザー可能
    case AccessLevel.OWNER_PRIVATE:
      return isOwner;
    case AccessLevel.ADMIN:
      return false; // 管理者チェックは上部で完了している
    default:
      return false;
  }
}