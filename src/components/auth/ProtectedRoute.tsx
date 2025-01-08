// src/components/auth/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

type AccessLevel = 'admin' | 'stem' | 'branch';

interface ProtectedRouteProps {
  children: React.ReactNode;
  accessLevel: AccessLevel;
  creatorId?: string; // branchレベルでの作成者ID確認用
}

export const ProtectedRoute = ({ 
  children, 
  accessLevel,
  creatorId 
}: ProtectedRouteProps) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // stemレベルは誰でもアクセス可能
  if (accessLevel === 'stem') {
    return <>{children}</>;
  }

  // 未認証ユーザーはサインインページへリダイレクト
  if (!isAuthenticated) {
    return <Navigate to="/auth/signin" />;
  }

  // adminレベルの確認
  if (accessLevel === 'admin' && user?.attributes?.['custom:role'] !== 'admin') {
    return <Navigate to="/" />;
  }

  // branchレベルの確認（作成者または管理者のみ編集可能）
  if (accessLevel === 'branch') {
    const isCreator = creatorId === user?.username;
    const isAdmin = user?.attributes?.['custom:role'] === 'admin';
    
    if (!isCreator && !isAdmin) {
      return <Navigate to="/" />;
    }
  }

  return <>{children}</>;
};