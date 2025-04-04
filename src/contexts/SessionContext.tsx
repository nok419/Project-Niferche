// src/contexts/SessionContext.tsx
import { createContext, useContext, useState, ReactNode } from 'react';
import { SessionUser } from '../types/auth';

/**
 * シンプルなセッションコンテキスト（モックデータ対応）
 */
interface SessionContextType {
  user: SessionUser | null;
  isSignedIn: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// モックユーザーデータ
const MOCK_USERS: Record<string, { password: string; data: SessionUser }> = {
  'admin': {
    password: 'password',
    data: {
      username: 'admin',
      userId: 'user-1',
      attributes: {
        email: 'admin@example.com',
        'custom:role': 'admin'
      }
    }
  },
  'user': {
    password: 'password',
    data: {
      username: 'user',
      userId: 'user-2',
      attributes: {
        email: 'user@example.com',
        'custom:role': 'user'
      }
    }
  }
};

const SessionContext = createContext<SessionContextType>({
  user: null,
  isSignedIn: false,
  login: async () => false,
  logout: () => {}
});

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<SessionUser | null>(null);

  const login = async (username: string, password: string): Promise<boolean> => {
    // モックデータでの認証
    const mockUser = MOCK_USERS[username];
    if (mockUser && mockUser.password === password) {
      setUser(mockUser.data);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <SessionContext.Provider
      value={{
        user,
        isSignedIn: !!user,
        login,
        logout
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => useContext(SessionContext);