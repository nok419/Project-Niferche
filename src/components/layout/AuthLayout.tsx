// components/layout/AuthLayout.tsx
import { Outlet } from 'react-router-dom';
import { NavigationHeader } from './navigation-header';
import { View } from '@aws-amplify/ui-react';
import { useAuth } from '../auth/AuthContext';
import { Navigate } from 'react-router-dom';

export const AuthLayout = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
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