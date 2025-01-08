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
import { useAuth } from '../../../components/auth/AuthContext';

export const SignInPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn(username, password);
      navigate('/');
    } catch (error: any) {
      setError(error.message);
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