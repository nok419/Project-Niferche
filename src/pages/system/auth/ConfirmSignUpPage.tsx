// src/pages/auth/ConfirmSignUpPage.tsx
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { confirmSignUp, resendSignUpCode } from 'aws-amplify/auth';
import {
  Button,
  TextField,
  View,
  Heading,
  Text,
  Flex
} from '@aws-amplify/ui-react';

export function ConfirmSignUpPage() {
  const [searchParams] = useSearchParams();
  const username = searchParams.get('username') || '';
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [resendSuccess, setResendSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    try {
      await confirmSignUp({
        username,
        confirmationCode: code
      });
      navigate('/auth/signin');
    } catch (error) {
      console.error('Error confirming sign up:', error);
      setError('確認コードの検証に失敗しました');
    }
  }

  async function handleResendCode() {
    try {
      await resendSignUpCode({ username });
      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 3000);
    } catch (error) {
      console.error('Error resending code:', error);
      setError('確認コードの再送信に失敗しました');
    }
  }

  return (
    <View padding="medium">
      <form onSubmit={handleSubmit}>
        <Flex direction="column" gap="medium">
          <Heading level={3}>アカウント確認</Heading>

          {error && (
            <Text color="red" fontSize="medium">
              {error}
            </Text>
          )}

          {resendSuccess && (
            <Text color="green" fontSize="medium">
              確認コードを再送信しました
            </Text>
          )}

          <Text>
            {username}宛に確認コードを送信しました。
            メールをご確認の上、確認コードを入力してください。
          </Text>

          <TextField
            label="確認コード"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />

          <Button type="submit" variation="primary">
            確認
          </Button>

          <Button
            onClick={handleResendCode}
            variation="link"
            isDisabled={resendSuccess}
          >
            確認コードを再送信
          </Button>
        </Flex>
      </form>
    </View>
  );
}