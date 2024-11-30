// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { fetchUserAttributes } from 'aws-amplify/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  nickname: string | null;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { authStatus } = useAuthenticator();
  const [isAdmin, setIsAdmin] = useState(false);
  const [nickname, setNickname] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      if (authStatus === 'authenticated') {
        try {
          const attributes = await fetchUserAttributes();
          setIsAdmin(attributes.userRole === 'admin');
          setNickname(attributes.nickname || null);
        } catch (err) {
          setError('Failed to fetch user attributes');
          console.error(err);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [authStatus]);

  const value = {
    isAuthenticated: authStatus === 'authenticated',
    isAdmin,
    nickname,
    loading,
    error
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
