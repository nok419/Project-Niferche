// src/pages/admin/AdminDashboardPage.tsx
import { View, Heading, Text, Button } from '@aws-amplify/ui-react';
import { useNavigate } from 'react-router-dom';

export const AdminDashboardPage = () => {
  const navigate = useNavigate();

  return (
    <View padding="2rem">
      <Heading level={2}>管理ダッシュボード</Heading>
      <Text marginTop="1rem">
        ここではユーザー管理やコンテンツ審査などの管理機能を行えます。
        （実際の機能は今後実装予定）
      </Text>

      <Button onClick={() => navigate('/') } marginTop="2rem">
        トップページへ戻る
      </Button>
    </View>
  );
};
