// src/pages/system/auth/SignUpPage.tsx
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
// 新: SessionContext から
import { useSession } from '../../../contexts/SessionContext';

export const SignUpPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // 旧: const { signUp } = useAuth();
  const { signUp } = useSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('パスワードが一致しません');
      return;
    }
    try {
      await signUp(username, password, email);
      // サインアップ成功 → 確認コード入力画面へ
      navigate('/auth/confirm', { 
        state: { username, email } 
      });
    } catch (error: any) {
      setError(error.message || 'Unknown error');
    }
  };

  return (
    <View padding="medium">
      <Heading level={2}>アカウント作成</Heading>
      {error && <Alert variation="error">{error}</Alert>}
      <form onSubmit={handleSubmit}>
        <TextField
          label="ユーザー名"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <TextField
          label="メールアドレス"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          label="パスワード"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <TextField
          label="パスワード（確認）"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <Button type="submit" variation="primary">
          アカウント作成
        </Button>
      </form>
      <Text>
        すでにアカウントをお持ちの方は
        <Button
          variation="link"
          onClick={() => navigate('/auth/signin')}
        >
          サインイン
        </Button>
      </Text>
    </View>
  );
};
