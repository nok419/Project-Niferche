// src/pages/system/auth/SignInPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  View, 
  Heading, 
  TextField, 
  Button, 
  Text,
  Alert
} from '@aws-amplify/ui-react';
import { useSession } from '../../../contexts/SessionContext';

export const SignInPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const success = await login(username, password);
      if (success) {
        navigate('/');
      } else {
        setError('ログインに失敗しました。ユーザー名とパスワードを確認してください。');
      }
    } catch (error: any) {
      setError(error.message || 'Unknown error');
    }
  };

  return (
    <View padding="medium">
      <Heading level={2}>サインイン</Heading>
      {error && <Alert variation="error">{error}</Alert>}
      <form onSubmit={handleSubmit}>
        <TextField
          label="ユーザー名"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <TextField
          label="パスワード"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" variation="primary">
          サインイン
        </Button>
      </form>
      <Text>
        アカウントをお持ちでない方は
        <Button
          variation="link"
          onClick={() => navigate('/auth/signup')}
        >
          新規登録
        </Button>
      </Text>
      <View marginTop="1rem">
        <Alert variation="info">
          テスト用アカウント:<br />
          管理者: username=admin, password=password<br />
          一般: username=user, password=password
        </Alert>
      </View>
    </View>
  );
};