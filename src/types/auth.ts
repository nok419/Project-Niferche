// src/types/auth.ts
import { UserAttributeKey } from 'aws-amplify/auth';
export enum AccessLevel {
    PUBLIC = 'PUBLIC',             // 誰でも閲覧可能
    AUTHENTICATED = 'AUTH',        // ログインユーザーのみ閲覧可能
    OWNER_PUBLIC = 'OWNER_PUBLIC', // 所有者のみ編集可能、他ユーザーは閲覧可能
    OWNER_PRIVATE = 'OWNER_PRIVATE', // 所有者のみアクセス可能
    ADMIN = 'ADMIN'               // 管理者のみアクセス可能
  }
  
  export interface UserRole {
    role: 'user' | 'admin';
  }
  
  export interface AuthUser {
    userId: string;
    username: string;
    role: 'user' | 'admin';
    email?: string;
    nickname?: string;
    attributes?: {
      [key in UserAttributeKey]?: string;
    };
  }
  