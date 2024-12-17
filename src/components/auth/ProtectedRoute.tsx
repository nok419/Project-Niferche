// src/components/auth/ProtectedRoute.tsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { ReactNode } from 'react';

export enum AccessLevel {
  PUBLIC = 'PUBLIC',             // 誰でも閲覧可能
  AUTHENTICATED = 'AUTH',        // ログインユーザーのみ閲覧可能
  OWNER_PUBLIC = 'OWNER_PUBLIC', // 所有者のみ編集可能、他ユーザーは閲覧可能
  OWNER_PRIVATE = 'OWNER_PRIVATE', // 所有者のみアクセス可能
  ADMIN = 'ADMIN'               // 管理者のみアクセス可能
}

interface ProtectedRouteProps {
  children: ReactNode;
  accessLevel: AccessLevel;
  ownerId?: string;
}

interface ReadOnlyWrapperProps {
  children: ReactNode;
}

const ReadOnlyWrapper = ({ children }: ReadOnlyWrapperProps) => {
  // 編集用のUIを無効化するラッパー
  return (
    <div className="read-only-content">
      {children}
    </div>
  );
};

export function ProtectedRoute({ 
  children, 
  accessLevel, 
  ownerId 
}: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // PUBLIC - 常にアクセス可能
  if (accessLevel === AccessLevel.PUBLIC) {
    return <>{children}</>;
  }

  // 未認証ユーザーはログインページへリダイレクト
  if (!isAuthenticated || !user) {
    return <Navigate to="/auth/signin" state={{ from: location }} replace />;
  }

  // 認証済みユーザーのアクセス制御
  switch (accessLevel) {
    case AccessLevel.AUTHENTICATED:
      return <>{children}</>;

    case AccessLevel.OWNER_PUBLIC:
      // 管理者は編集可能
      if (user.role === 'admin') {
        return <>{children}</>;
      }
      // 所有者は編集可能
      if (ownerId && user.userId === ownerId) {
        return <>{children}</>;
      }
      // その他のユーザーは閲覧のみ可能
      return <ReadOnlyWrapper>{children}</ReadOnlyWrapper>;

    case AccessLevel.OWNER_PRIVATE:
      // 管理者または所有者のみアクセス可能
      if (user.role === 'admin' || (ownerId && user.userId === ownerId)) {
        return <>{children}</>;
      }
      return <Navigate to="/" replace />;

    case AccessLevel.ADMIN:
      // 管理者のみアクセス可能
      if (user.role === 'admin') {
        return <>{children}</>;
      }
      return <Navigate to="/" replace />;

    default:
      return <Navigate to="/" replace />;
  }
}