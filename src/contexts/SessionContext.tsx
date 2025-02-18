// src/contexts/SessionContext.tsx
import { createContext, useCallback, useEffect, useMemo, useState, useContext, PropsWithChildren } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { getCurrentUser, fetchAuthSession, signIn as amplifySignIn, signUp as amplifySignUp, confirmSignUp as amplifyConfirmSignUp, JWT } from 'aws-amplify/auth';

/**
 * Amplify UIのuseAuthenticatorでauthStatusを取得し、
 * fetchAuthSession()でトークンやユーザー情報を取得するコンテキスト。
 */
type SessionContextType = {
  idToken?: JWT;
  expiration?: Date;
  user?: { username: string; attributes?: Record<string, string> };
  isSignedIn: boolean;
  loadSession: (forceRefresh?: boolean) => Promise<void>;

  signIn: (username: string, password: string) => Promise<void>;
  signUp: (username: string, password: string, email: string) => Promise<void>;
  confirmSignUp: (username: string, code: string) => Promise<void>;

  signOut: () => Promise<void>;
};

const SessionContext = createContext<SessionContextType>({
  isSignedIn: false,
  loadSession: async () => {},
  signIn: async () => {},
  signUp: async () => {},
  confirmSignUp: async () => {},
  signOut: async () => {},
});

export const SessionProvider = ({ children }: PropsWithChildren) => {
  const { authStatus, signOut: amplifySignOut } = useAuthenticator((ctx) => [ctx.authStatus, ctx.signOut]);

  const [idToken, setIdToken] = useState<JWT | undefined>();
  const [expiration, setExpiration] = useState<Date | undefined>();
  const [user, setUser] = useState<{ username: string; attributes?: Record<string, string> }>();

  const isSignedIn = useMemo(() => !!idToken, [idToken]);

  const loadSession = useCallback(async (forceRefresh?: boolean) => {
    try {
      const session = await fetchAuthSession({ forceRefresh });
      setIdToken(session.tokens?.idToken);
      setExpiration(session.credentials?.expiration);

      const currentUser = await getCurrentUser();
      if (currentUser) {
        setUser({
          username: currentUser.username,
          attributes: (currentUser.signInDetails as any)?.userAttributes || {},
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

  const handleSignIn = async (username: string, password: string) => {
    await amplifySignIn({ username, password });
    await loadSession();
  };

  const handleSignUp = async (username: string, password: string, email: string) => {
    await amplifySignUp({
      username,
      password,
      options: {
        userAttributes: { email },
      },
    });
  };

  const handleConfirmSignUp = async (username: string, code: string) => {
    await amplifyConfirmSignUp({ username, confirmationCode: code });
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

