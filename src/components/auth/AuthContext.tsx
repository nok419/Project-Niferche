// File: components/auth/AuthContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, signIn as amplifySignIn, signOut as amplifySignOut } from 'aws-amplify/auth';
import { type AuthUser } from '@aws-amplify/auth';

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  error: Error | null;
  isAuthenticated: boolean;
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  checkUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setMounted(true);
    checkUser();
  }, []);

  async function checkUser() {
    try {
      setIsLoading(true);
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setError(null);
    } catch (err) {
      setUser(null);
      setError(err instanceof Error ? err : new Error('Authentication error'));
    } finally {
      setIsLoading(false);
    }
  }

  async function signIn(username: string, password: string) {
    try {
      setIsLoading(true);
      await amplifySignIn({ username, password });
      await checkUser();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Sign in failed'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }

  async function signOut() {
    try {
      setIsLoading(true);
      await amplifySignOut();
      setUser(null);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Sign out failed'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }

  const value = {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
    signIn,
    signOut,
    checkUser
  };

  // 初期マウント時は何もレンダリングしない
  if (!mounted) {
    return null;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}