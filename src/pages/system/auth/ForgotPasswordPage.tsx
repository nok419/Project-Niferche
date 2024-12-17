// 1. /pages/system/auth/ForgotPasswordPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { resetPassword } from 'aws-amplify/auth';
import {
  Flex,
  Card,
  Text,
  TextField,
  Button,
  Alert,
} from '@aws-amplify/ui-react';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await resetPassword({ username: email });
      setSuccess(true);
      setTimeout(() => {
        navigate('/auth/reset-password');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
    } finally {
      setLoading(false);
    }
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
            パスワードをお忘れの方
          </Text>

          {error && (
            <Alert variation="error">
              {error}
            </Alert>
          )}

          {success && (
            <Alert variation="success">
              パスワードリセットの手順をメールで送信しました
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Flex direction="column" gap="1rem">
              <TextField
                label="メールアドレス"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="登録済みのメールアドレスを入力"
                isDisabled={loading}
              />

              <Button
                type="submit"
                variation="primary"
                isLoading={loading}
                loadingText="送信中..."
                isFullWidth
              >
                パスワードリセットを申請
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