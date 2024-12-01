// src/components/auth/Authentication.tsx
import { 
  Authenticator,
  View,
  useTheme,
  Text,
  Heading,
  TextField,
  useAuthenticator
} from '@aws-amplify/ui-react';
import { signUp, type SignUpInput, type SignUpOutput } from 'aws-amplify/auth';

import { useNavigate, useLocation } from 'react-router-dom';
import { fetchUserAttributes } from 'aws-amplify/auth';
import { useState } from 'react';

interface AuthenticationProps {
  initialState?: 'signIn' | 'signUp';
}

interface ValidationError {
  [key: string]: string;
}

export const Authentication = ({ initialState = 'signIn' }: AuthenticationProps) => {
  const { tokens } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);
  const { submitForm } = useAuthenticator();

  // サインイン後のリダイレクト処理
  const handleAuthSuccess = async () => {
    try {
      const attributes = await fetchUserAttributes();
      const from = location.state?.from?.pathname || '/';
      
      // 管理者の場合、管理画面へリダイレクト
      if (attributes.userRole === 'admin') {
        navigate('/admin', { replace: true });
        return;
      }
      
      navigate(from, { replace: true });
    } catch (err) {
      setError('ユーザー情報の取得に失敗しました');
      console.error('Auth Error:', err);
    }
  };

  return (
    <View padding={tokens.space.large}>
      <Authenticator
        initialState={initialState}
        components={{
          Header() {
            return (
              <Heading level={3} padding={tokens.space.large}>
                {initialState === 'signIn' ? 'ログイン' : 'アカウント作成'}
              </Heading>
            );
          },
          Footer() {
            return (
              <View textAlign="center" padding={tokens.space.large}>
                <Text color={tokens.colors.neutral[80]}>
                  &copy; 2024 Project Niferche
                </Text>
              </View>
            );
          },
          SignUp: {
            FormFields() {
              return (
                <>
                  <Authenticator.SignUp.FormFields />
                  <TextField
                    label="ニックネーム"
                    name="nickname"
                    placeholder="2文字以上で入力してください"
                    isRequired={true}
                  />
                </>
              );
            }
          }
        }}
        services={{
          async validateCustomSignUp(formData: Record<string, any>): Promise<ValidationError> {
            if (!formData.nickname || formData.nickname.length < 2) {
              return {
                nickname: 'ニックネームは2文字以上で入力してください',
              };
            }
            return {};
          },
          async handleSignUp(formData: SignUpInput): Promise<SignUpOutput> {
            try {
              const signUpResult = await signUp(formData);
              await handleAuthSuccess();
              submitForm();
              return signUpResult;
            } catch (error) {
              console.error('Error signing up:', error);
              setError(error instanceof Error ? error.message : 'サインアップに失敗しました');
              throw error;
            }
          }
        }}
        signUpAttributes={['email', 'nickname']}
      />
      {error && (
        <View 
          backgroundColor="background.error"
          padding={tokens.space.medium}
          borderRadius={tokens.radii.medium}
          marginTop={tokens.space.medium}
        >
          <Text color="font.error">{error}</Text>
        </View>
      )}
    </View>
  );
};