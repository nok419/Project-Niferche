// src/hooks/useAuth.ts
import { getCurrentUser, signIn, signOut, AuthUser } from 'aws-amplify/auth';
import { useContext, createContext, useState, useEffect } from 'react';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  error: Error | null;
  isAuthenticated: boolean;
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  checkUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const checkUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setError(null);
    } catch (e) {
      setUser(null);
      setError(e instanceof Error ? e : new Error('Authentication error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    signIn: async (username: string, password: string) => {
      try {
        await signIn({ username, password });
        await checkUser();
      } catch (e) {
        setError(e instanceof Error ? e : new Error('Sign in failed'));
        throw e;
      }
    },
    signOut: async () => {
      try {
        await signOut();
        setUser(null);
      } catch (e) {
        setError(e instanceof Error ? e : new Error('Sign out failed'));
        throw e;
      }
    },
    checkUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};