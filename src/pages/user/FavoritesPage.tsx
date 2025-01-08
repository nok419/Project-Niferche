// src/pages/user/FavoritesPage.tsx
import { 
    View, 
    Heading, 
    Collection, 
    Card,
    Text
  } from '@aws-amplify/ui-react';
  import { useAuth } from '../../components/auth/AuthContext';
  import { Navigate } from 'react-router-dom';
  
  interface FavoriteItem {
    id: string;
    title: string;
    type: string;
  }
  
  export const FavoritesPage = () => {
    const { isAuthenticated } = useAuth(); // user削除
  
    if (!isAuthenticated) {
      return <Navigate to="/auth/signin" />;
    }
  
    // サンプルデータ（実際にはバックエンドから取得）
    const sampleFavorites: FavoriteItem[] = [
      { id: '1', title: 'サンプルコンテンツ1', type: 'story' },
      { id: '2', title: 'サンプルコンテンツ2', type: 'idea' }
    ];
  
    return (
      <View padding="medium">
        <Heading level={2}>お気に入り</Heading>
        <Collection
          type="grid"
          items={sampleFavorites}
          gap="medium"
          templateColumns={{
            base: "1fr",
            medium: "1fr 1fr"
          }}
        >
          {(item: FavoriteItem) => (
            <Card key={item.id}>
              <Text>{item.title}</Text>
              <Text fontSize="small">タイプ: {item.type}</Text>
            </Card>
          )}
        </Collection>
      </View>
    );
  };