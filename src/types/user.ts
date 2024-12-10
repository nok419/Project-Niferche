// src/types/user.ts
export interface UserProfile {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  preferences?: {
    theme?: 'light' | 'dark';
    language?: string;
  };
}

// src/contexts/UserContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';
import { Auth } from 'aws-amplify';
import { UserProfile } from '../types/user';

interface UserContextType {
  user: UserProfile | null;
  loading: boolean;
  error: Error | null;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const userData = await Auth.currentAuthenticatedUser();
      setUser({
        id: userData.attributes.sub,
        username: userData.username,
        email: userData.attributes.email,
        role: userData.attributes['custom:role'] || 'user',
      });
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await Auth.signOut();
      setUser(null);
    } catch (err) {
      setError(err as Error);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      // プロフィール更新のロジックを実装
      await Auth.updateUserAttributes(
        await Auth.currentAuthenticatedUser(),
        updates as Record<string, string>
      );
      setUser(prev => prev ? { ...prev, ...updates } : null);
    } catch (err) {
      setError(err as Error);
    }
  };

  return (
    <UserContext.Provider value={{ user, loading, error, signOut, updateProfile }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};