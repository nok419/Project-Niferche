// src/components/common/FavoriteButton.tsx
import { Button } from '@aws-amplify/ui-react';
import { useAuth } from '../../components/auth/AuthContext';
import { useState } from 'react';

interface FavoriteButtonProps {
  contentId: string;
  initialState?: boolean;
  onToggle?: (isFavorite: boolean) => void;
}

export const FavoriteButton = ({ 
  contentId, 
  initialState = false,
  onToggle 
}: FavoriteButtonProps) => {
  const { isAuthenticated } = useAuth();
  const [isFavorite, setIsFavorite] = useState(initialState);

  const handleFavoriteClick = async () => {
    if (!isAuthenticated) {
      // 未認証ユーザーへの処理
      return;
    }

    try {
      const newState = !isFavorite;
      setIsFavorite(newState);
      onToggle?.(newState); // 親コンポーネントに状態変更を通知
      
      // TODO: バックエンドとの連携
      console.log(`Toggle favorite for content: ${contentId}`);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  return (
    <Button
      onClick={handleFavoriteClick}
      variation="link"
      color={isFavorite ? 'red' : 'gray'}
    >
      {isFavorite ? '★' : '☆'}
    </Button>
  );
};