// src/components/layout/CallLayout.tsx
import { View, Flex } from '@aws-amplify/ui-react';
import { Outlet } from 'react-router-dom';

export const CallLayout = () => {
  return (
    <View
      backgroundColor="background.primary"
      padding={{ base: 'medium', large: 'large' }}
      minHeight="calc(100vh - 60px)"
    >
      <Flex
        direction="column"
        maxWidth="1200px"
        margin="0 auto"
        gap="large"
      >
        <Outlet />
      </Flex>
    </View>
  );
};