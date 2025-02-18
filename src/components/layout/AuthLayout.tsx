// components/layout/AuthLayout.tsx
import { Outlet, Navigate } from 'react-router-dom';
import { View } from '@aws-amplify/ui-react';
import { NavigationHeader } from './navigation-header';

// 旧: import { useAuth } from '../auth/AuthContext';
import { useSession } from '../../contexts/SessionContext';

export const AuthLayout = () => {
  // 旧: const { isAuthenticated } = useAuth();
  const { isSignedIn } = useSession();

  // もしサインイン済みならトップへリダイレクト
  if (isSignedIn) {
    return <Navigate to="/" replace />;
  }

  return (
    <View>
      <NavigationHeader />
      <View
        padding="medium"
        style={{
          backgroundColor: 'var(--amplify-colors-background-secondary)',
          minHeight: 'calc(100vh - var(--header-height))'
        }}
      >
        <View 
          maxWidth="400px"
          margin="0 auto"
          padding="medium"
          backgroundColor="background.primary"
          style={{
            borderRadius: 'var(--amplify-radii-medium)',
            boxShadow: 'var(--amplify-shadows-medium)'
          }}
        >
          <Outlet />
        </View>
      </View>
    </View>
  );
};
