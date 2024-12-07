// pages/auth/SignInPage.tsx
import { useState } from 'react';
import { useAuth } from '../../../components/auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  TextField,
  View,
  Heading,
  Text,
  Flex
} from '@aws-amplify/ui-react';

export function SignInPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signIn, isLoading } = useAuth();  // 一度だけuseAuthを呼び出し
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await signIn(username, password);
      navigate('/');
    } catch (error) {
      setError('ログインに失敗しました');
    }
  }

  // ローディング状態の処理を追加
  if (isLoading) {
    return <View padding="medium">Loading...</View>;
  }

  return (
    <View padding="medium">
      <form onSubmit={handleSubmit}>
        <Flex direction="column" gap="medium">
          <Heading level={3}>サインイン</Heading>
          
          {error && (
            <Text color="red" fontSize="medium">
              {error}
            </Text>
          )}

          <TextField
            label="ユーザー名"
            name="username"
            placeholder="ユーザー名を入力"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />

          <TextField
            label="パスワード"
            name="password"
            type="password"
            placeholder="パスワードを入力"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />

          <Button type="submit" variation="primary">
            サインイン
          </Button>

          <Button
            onClick={() => navigate('/auth/signup')}
            variation="link"
          >
            アカウントをお持ちでない方
          </Button>
        </Flex>
      </form>
    </View>
  );
}