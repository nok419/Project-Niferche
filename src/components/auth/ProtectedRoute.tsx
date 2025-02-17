// src/components/auth/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { useSession } from '../../contexts/SessionContext';
import React from 'react';

type AccessLevel = 'admin' | 'branch'; // 必要に応じてカスタム

interface ProtectedRouteProps {
  children: React.ReactNode;
  accessLevel?: AccessLevel;
  creatorId?: string;
}

/**
 * 認証が必要なルート用。サインインしていなければ /auth/signin へ。
 * さらにaccessLevelがadminなら、ユーザー属性 custom:role=admin をチェックする例。
 */
export const ProtectedRoute = ({
  children,
  accessLevel,
  creatorId,
}: ProtectedRouteProps) => {
  const { isSignedIn, user } = useSession();

  if (!isSignedIn) {
    return <Navigate to="/auth/signin" replace />;
  }

  if (accessLevel === 'admin') {
    const role = user?.attributes?.['custom:role'];
    if (role !== 'admin') {
      return <Navigate to="/" />;
    }
  }

  if (accessLevel === 'branch') {
    const role = user?.attributes?.['custom:role'];
    const isCreator = creatorId === user?.username;
    const isAdmin = role === 'admin';
    if (!isCreator && !isAdmin) {
      return <Navigate to="/" />;
    }
  }

  return <>{children}</>;
};

