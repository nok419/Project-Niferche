// 2. /pages/system/auth/ResetPasswordPage.tsx 
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { confirmResetPassword } from 'aws-amplify/auth';
import {
  Flex,
  Card,
  Text,
  TextField,
  Button,
  Alert,
  PasswordField,
} from '@aws-amplify/ui-react';

export const ResetPasswordPage: React.FC = () => {
  const [formState, setFormState] = useState({
    email: '',
    code: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formState.newPassword !== formState.confirmPassword) {
      setError('パスワードが一致しません');
      return;
    }

    setLoading(true);

    try {
      await confirmResetPassword({
        username: formState.email,
        confirmationCode: formState.code,
        newPassword: formState.newPassword,
      });
      navigate('/auth/signin', { 
        state: { message: 'パスワードが正常に更新されました' } 
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormState((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  return (
    <Flex direction="column" alignItems="center" padding="2rem">
      <Card variation="outlined" width="100%" maxWidth="400px">
        <Flex direction="column" gap="1rem">
          <Text
            variation="primary"
            fontSize="1.5rem"
            fontWeight="bold"
            textAlign="center"
          >
            新しいパスワードの設定
          </Text>

          {error && (
            <Alert variation="error">
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Flex direction="column" gap="1rem">
              <TextField
                label="メールアドレス"
                type="email"
                value={formState.email}
                onChange={handleChange('email')}
                required
                isDisabled={loading}
              />

              <TextField
                label="確認コード"
                value={formState.code}
                onChange={handleChange('code')}
                required
                placeholder="メールに記載された確認コード"
                isDisabled={loading}
              />

              <PasswordField
                label="新しいパスワード"
                value={formState.newPassword}
                onChange={handleChange('newPassword')}
                required
                isDisabled={loading}
              />

              <PasswordField
                label="新しいパスワード（確認）"
                value={formState.confirmPassword}
                onChange={handleChange('confirmPassword')}
                required
                isDisabled={loading}
              />

              <Button
                type="submit"
                variation="primary"
                isLoading={loading}
                loadingText="更新中..."
                isFullWidth
              >
                パスワードを更新
              </Button>

              <Button
                onClick={() => navigate('/auth/signin')}
                variation="link"
                isFullWidth
              >
                ログインページに戻る
              </Button>
            </Flex>
          </form>
        </Flex>
      </Card>
    </Flex>
  );
};