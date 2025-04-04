// src/components/auth/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { useSession } from '../../contexts/SessionContext';
import React from 'react';
import { AccessLevel, getUserRole } from '../../types/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  accessLevel?: AccessLevel;
  creatorId?: string;
}

/**
 * 認証が必要なルート用。サインインしていなければ /auth/signin へ。
 * さらにaccessLevelがadminなら、ユーザー属性 custom:role=admin をチェックする。
 */
export const ProtectedRoute = ({
  children,
  accessLevel = AccessLevel.AUTHENTICATED,
  creatorId,
}: ProtectedRouteProps) => {
  const { isSignedIn, user } = useSession();

  // 非認証状態ならログインページへリダイレクト
  if (!isSignedIn) {
    // PUBLICレベルなら認証不要
    if (accessLevel === AccessLevel.PUBLIC) {
      return <>{children}</>;
    }
    return <Navigate to="/auth/signin" replace />;
  }

  // 管理者権限レベルチェック
  if (accessLevel === AccessLevel.ADMIN && user) {
    const userRole = getUserRole(user);
    if (userRole !== 'admin') {
      return <Navigate to="/" replace />;  // 権限不足の場合はホームへリダイレクト
    }
  }

  // 所有者と管理者のみアクセス可能なコンテンツ
  if (accessLevel === AccessLevel.OWNER_PRIVATE && creatorId && user) {
    const userRole = getUserRole(user);
    const isCreator = creatorId === user?.username || creatorId === user?.userId;
    const isAdmin = userRole === 'admin';
    
    if (!isCreator && !isAdmin) {
      return <Navigate to="/" replace />;
    }
  }
  
  return <>{children}</>;
};