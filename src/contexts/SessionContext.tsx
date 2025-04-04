// src/contexts/SessionContext.tsx
import { createContext, useCallback, useEffect, useMemo, useState, useContext, PropsWithChildren } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { getCurrentUser, fetchAuthSession, signIn as amplifySignIn, signUp as amplifySignUp, confirmSignUp as amplifyConfirmSignUp, JWT } from 'aws-amplify/auth';
import { SessionUser, AuthError, AuthResult } from '../types/auth';

/**
 * Amplify UIのuseAuthenticatorでauthStatusを取得し、
 * fetchAuthSession()でトークンやユーザー情報を取得するコンテキスト。
 */
type SessionContextType = {
  idToken?: JWT;
  expiration?: Date;
  user?: SessionUser;
  isSignedIn: boolean;
  loadSession: (forceRefresh?: boolean) => Promise<void>;

  signIn: (username: string, password: string) => Promise<AuthResult<void>>;
  signUp: (username: string, password: string, email: string) => Promise<AuthResult<void>>;
  confirmSignUp: (username: string, code: string) => Promise<AuthResult<void>>;

  signOut: () => Promise<void>;
};

const SessionContext = createContext<SessionContextType>({
  isSignedIn: false,
  loadSession: async () => {},
  signIn: async () => ({ success: false }),
  signUp: async () => ({ success: false }),
  confirmSignUp: async () => ({ success: false }),
  signOut: async () => {},
});

export const SessionProvider = ({ children }: PropsWithChildren) => {
  const { authStatus, signOut: amplifySignOut } = useAuthenticator((ctx) => [ctx.authStatus, ctx.signOut]);

  const [idToken, setIdToken] = useState<JWT | undefined>();
  const [expiration, setExpiration] = useState<Date | undefined>();
  const [user, setUser] = useState<SessionUser | undefined>();

  const isSignedIn = useMemo(() => !!idToken, [idToken]);

  const loadSession = useCallback(async (forceRefresh?: boolean) => {
    try {
      const session = await fetchAuthSession({ forceRefresh });
      setIdToken(session.tokens?.idToken);
      setExpiration(session.credentials?.expiration);

      const currentUser = await getCurrentUser();
      if (currentUser) {
        // 型アサーションでanyを回避
        const signInDetails = currentUser.signInDetails as { 
          userAttributes?: Record<string, string> 
        } | undefined;
        
        setUser({
          username: currentUser.username,
          userId: currentUser.userId,
          attributes: signInDetails?.userAttributes || {},
        });
      } else {
        setUser(undefined);
      }
    } catch (err) {
      console.error('Failed to load session:', err);
      setIdToken(undefined);
      setExpiration(undefined);
      setUser(undefined);
    }
  }, []);

  const handleSignOut = async () => {
    await amplifySignOut();
  };

  const handleSignIn = async (username: string, password: string): Promise<AuthResult<void>> => {
    try {
      await amplifySignIn({ username, password });
      await loadSession();
      return { success: true };
    } catch (error) {
      const authError = error as AuthError;
      return { 
        success: false, 
        error: {
          name: authError.name || 'AuthError',
          message: authError.message || 'Failed to sign in',
          code: authError.code,
          stack: authError.stack
        }
      };
    }
  };

  const handleSignUp = async (username: string, password: string, email: string): Promise<AuthResult<void>> => {
    try {
      await amplifySignUp({
        username,
        password,
        options: {
          userAttributes: { email },
        },
      });
      return { success: true };
    } catch (error) {
      const authError = error as AuthError;
      return { 
        success: false, 
        error: {
          name: authError.name || 'AuthError',
          message: authError.message || 'Failed to sign up',
          code: authError.code,
          stack: authError.stack
        }
      };
    }
  };

  const handleConfirmSignUp = async (username: string, code: string): Promise<AuthResult<void>> => {
    try {
      await amplifyConfirmSignUp({ username, confirmationCode: code });
      return { success: true };
    } catch (error) {
      const authError = error as AuthError;
      return { 
        success: false, 
        error: {
          name: authError.name || 'AuthError',
          message: authError.message || 'Failed to confirm sign up',
          code: authError.code,
          stack: authError.stack
        }
      };
    }
  };

  useEffect(() => {
    if (authStatus === 'authenticated') {
      loadSession();
    } else if (authStatus === 'unauthenticated') {
      setIdToken(undefined);
      setExpiration(undefined);
      setUser(undefined);
    }
  }, [authStatus, loadSession]);

  return (
      <SessionContext.Provider
        value={{
          idToken,
          expiration,
          user,
          isSignedIn,
          loadSession,
          signIn: handleSignIn,
          signUp: handleSignUp,
          confirmSignUp: handleConfirmSignUp,
          signOut: handleSignOut,
        }}
      >
        {children}
      </SessionContext.Provider>
  );
};

export const useSession = () => {
  return useContext(SessionContext);
};