// src/pages/auth/SignUpPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signUp } from 'aws-amplify/auth';
import {
  Button,
  TextField,
  View,
  Heading,
  Text,
  Flex
} from '@aws-amplify/ui-react';

export function SignUpPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    nickname: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('パスワードが一致しません');
      return;
    }

    try {
      await signUp({
        username: formData.username,
        password: formData.password,
        options: {
          userAttributes: {
            email: formData.email,
            nickname: formData.nickname
          },
          autoSignIn: true
        }
      });
      
      // 確認コード入力ページへ遷移
      navigate(`/auth/confirm?username=${formData.username}`);
    } catch (error) {
      console.error('Error in sign up:', error);
      setError('アカウント作成に失敗しました');
    }
  }

  return (
    <View padding="medium">
      <form onSubmit={handleSubmit}>
        <Flex direction="column" gap="medium">
          <Heading level={3}>アカウント作成</Heading>
          
          {error && (
            <Text color="red" fontSize="medium">
              {error}
            </Text>
          )}

          <TextField
            label="ユーザー名"
            name="username"
            placeholder="ユーザー名を入力"
            value={formData.username}
            onChange={handleChange}
            required
          />

          <TextField
            label="メールアドレス"
            name="email"
            type="email"
            placeholder="メールアドレスを入力"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <TextField
            label="ニックネーム"
            name="nickname"
            placeholder="ニックネームを入力"
            value={formData.nickname}
            onChange={handleChange}
            required
          />

          <TextField
            label="パスワード"
            name="password"
            type="password"
            placeholder="パスワードを入力"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <TextField
            label="パスワード (確認)"
            name="confirmPassword"
            type="password"
            placeholder="パスワードを再入力"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <Button type="submit" variation="primary">
            アカウント作成
          </Button>

          <Button
            onClick={() => navigate('/auth/signin')}
            variation="link"
          >
            すでにアカウントをお持ちの方
          </Button>
        </Flex>
      </form>
    </View>
  );
}
