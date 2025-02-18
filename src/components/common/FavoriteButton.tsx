// src/components/common/FavoriteButton.tsx
import { Button } from '@aws-amplify/ui-react';
import { useSession } from '../../contexts/SessionContext';
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
  const { isSignedIn } = useSession();
  const [isFavorite, setIsFavorite] = useState(initialState);

  const handleFavoriteClick = async () => {
    if (!isSignedIn) {
      alert('ログインが必要です');
      return;
    }

    try {
      const newState = !isFavorite;
      setIsFavorite(newState);
      onToggle?.(newState);
      // TODO: バックエンド連携 (GraphQL mutationなど)
      console.log(`Toggled favorite for contentId=${contentId}, newState=${newState}`);
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

