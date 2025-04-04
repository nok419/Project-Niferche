// src/pages/system/auth/ConfirmSignUpPage.tsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  View, 
  Heading, 
  TextField, 
  Button, 
  Text,
  Alert
} from '@aws-amplify/ui-react';

export const ConfirmSignUpPage = () => {
  const [code, setCode] = useState('');
  const [error] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const state = location.state as { username?: string };
    if (!state?.username) {
      // ユーザ名がない → サインアップ画面へ戻す
      navigate('/auth/signup');
    }
  }, [location, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // モックバージョンでは確認成功をシミュレート
    navigate('/auth/signin', {
      state: { message: 'アカウントが確認されました。サインインしてください。' }
    });
  };

  return (
    <View padding="medium">
      <Heading level={2}>アカウント確認</Heading>
      <Text>
        確認コードをメールアドレスに送信しました。
        コードを入力してアカウントを有効化してください。
      </Text>
      {error && <Alert variation="error">{error}</Alert>}
      <form onSubmit={handleSubmit}>
        <TextField
          label="確認コード"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />
        <Button type="submit" variation="primary">
          確認
        </Button>
      </form>
      <Text>
        コードが届かない場合は
        <Button
          variation="link"
          onClick={() => navigate('/auth/signup')}
        >
          アカウント作成をやり直す
        </Button>
      </Text>
      <View marginTop="1rem">
        <Alert variation="info">
          これはモックページです。任意のコードを入力してください。
        </Alert>
      </View>
    </View>
  );
};