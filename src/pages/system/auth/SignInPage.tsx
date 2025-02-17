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
// 旧: import { useAuth } from '../../../components/auth/AuthContext';
import { useSession } from '../../../contexts/SessionContext';

export const SignInPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // 旧: const { signIn } = useAuth();
  const { signIn } = useSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn(username, password);
      // 成功時トップページへ or 任意の遷移先
      navigate('/');
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
    </View>
  );
};
