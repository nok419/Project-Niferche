// src/pages/NotFoundPage.tsx
import { View, Heading, Button } from '@aws-amplify/ui-react';
import { useNavigate } from 'react-router-dom';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <View padding="2rem" textAlign="center">
      <Heading level={1}>404 - Page Not Found</Heading>
      <Button onClick={() => navigate('/')} marginTop="1rem">
        メインページに戻る
      </Button>
    </View>
  );
};