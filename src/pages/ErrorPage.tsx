// src/pages/error/ErrorPage.tsx
import { View, Heading, Text, Button } from '@aws-amplify/ui-react';
import { useNavigate } from 'react-router-dom';

export const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <View 
      padding="2rem"
      textAlign="center"
      maxWidth="600px"
      margin="0 auto"
    >
      <Heading level={1}>エラーが発生しました</Heading>
      <Text>
        申し訳ありません。予期せぬエラーが発生しました。
      </Text>
      <Button
        onClick={() => navigate('/')}
        variation="primary"
      >
        メインページに戻る
      </Button>
    </View>
  );
};