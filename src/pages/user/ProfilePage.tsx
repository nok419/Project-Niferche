// src/pages/user/ProfilePage.tsx
import { View, Heading, Text, Button, Card } from '@aws-amplify/ui-react';
import { useSession } from '../../contexts/SessionContext';
import { useState } from 'react';

export const ProfilePage = () => {
  const { isSignedIn, user, loadSession } = useSession();
  const [isEditing, setIsEditing] = useState(false);

  // ログインしてなければ ProtectedRoute で弾かれるはずだが
  // 念のため fallback
  if (!isSignedIn) {
    return <Text>ログインが必要です</Text>;
  }

  // user?.attributes から各種属性を取り出す
  const username = user?.username;
  const email = user?.attributes?.email;
  const role = user?.attributes?.['custom:role'];

  const handleRefreshSession = async () => {
    // IDトークンの有効期限切れ等を手動でリフレッシュしたいとき
    await loadSession(true);
    alert('トークンを再取得しました');
  };

  return (
    <View padding="medium">
      <Card>
        <Heading level={2}>プロフィールページ</Heading>

        <View padding="medium">
          <Text>ユーザー名: {username}</Text>
          <Text>メールアドレス: {email}</Text>
          <Text>ロール: {role ?? 'user'}</Text>
        </View>

        {isEditing ? (
          <Button onClick={() => setIsEditing(false)}>編集をキャンセル</Button>
        ) : (
          <Button onClick={() => setIsEditing(true)}>プロフィールを編集</Button>
        )}

        <Button onClick={handleRefreshSession} variation="link">
          トークンを再取得する
        </Button>
      </Card>
    </View>
  );
};
