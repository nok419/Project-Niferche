// src/components/auth/AuthContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';
import { 
  getCurrentUser,
  fetchAuthSession,
  signIn,
  signUp,
  signOut,
  confirmSignUp
} from 'aws-amplify/auth';

interface AuthContextType {
  user: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (username: string, password: string) => Promise<void>;
  signUp: (username: string, password: string, email: string) => Promise<void>;
  signOut: () => Promise<void>;
  confirmSignUp: (username: string, code: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const currentUser = await getCurrentUser();
      await fetchAuthSession(); // sessionの使用が必要ない場合は認証チェックのみ
      setUser(currentUser);
      setIsAuthenticated(true);
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const authSignIn = async (username: string, password: string) => {
    try {
      await signIn({ username, password });
      await checkAuthState();
    } catch (error) {
      throw error;
    }
  };

  const authSignUp = async (username: string, password: string, email: string) => {
    try {
      await signUp({
        username,
        password,
        options: {
          userAttributes: {
            email
          }
        }
      });
    } catch (error) {
      throw error;
    }
  };

  const authSignOut = async () => {
    try {
      await signOut();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      throw error;
    }
  };

  const authConfirmSignUp = async (username: string, code: string) => {
    try {
      await confirmSignUp({ username, confirmationCode: code });
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    signIn: authSignIn,
    signUp: authSignUp,
    signOut: authSignOut,
    confirmSignUp: authConfirmSignUp
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};