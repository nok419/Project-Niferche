// src/pages/user/ProfilePage.tsx
import { useState } from 'react'; // useEffect削除
import { 
  View, 
  Heading, 
  Button, 
  Card,
  Text
} from '@aws-amplify/ui-react'; // TextField削除
import { useAuth } from '../../components/auth/AuthContext';
import { useParams, Navigate } from 'react-router-dom';

export const ProfilePage = () => {
  const { user, isAuthenticated } = useAuth();
  const { userId } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  
  const canEdit = !userId || userId === user?.username;

  if (!isAuthenticated) {
    return <Navigate to="/auth/signin" />;
  }

  if (userId && userId !== user?.username) {
    return <Navigate to="/profile" />;
  }

  return (
    <View padding="medium">
      <Card>
        <Heading level={2}>プロフィール</Heading>
        <View padding="medium">
          <Text>ユーザー名: {user?.username}</Text>
          <Text>メールアドレス: {user?.attributes?.email}</Text>
          {user?.attributes?.['custom:role'] === 'admin' && (
            <Text>権限: 管理者</Text>
          )}
        </View>

        {canEdit && (
          <Button onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? 'キャンセル' : 'プロフィールを編集'}
          </Button>
        )}
      </Card>
    </View>
  );
};