// src/components/layout/CallLayout.tsx
import { View, Flex,Text } from '@aws-amplify/ui-react';
import { Outlet } from 'react-router-dom';
import { NavigationHeader } from './navigation-header';

export const CallLayout = () => {
  return (
    <Flex direction="column" height="100vh" width="100vw">
      <View
        position="fixed"
        top="0"
        left="0"
        right="0"
        style={{ zIndex: 1000 }}
        backgroundColor="background.primary"
      >
        <NavigationHeader />
      </View>

      <View height="60px" />
      
      <View
        as="main"
        flex="1"
        overflow="auto"
        backgroundColor="background.primary"
        padding={{ base: 'medium', large: 'large' }}
      >
        <View
          maxWidth="1200px"
          margin="0 auto"
        >
          <Outlet />
        </View>
      </View>

      <View
        as="footer"
        backgroundColor="background.secondary"
        padding="small"
        width="100%"
      >
        <Flex
          direction="row"
          alignItems="center"
          justifyContent="center"
          gap="small"
          height="40px"
        >
          <Text fontSize="small">
            &copy; 2024 Project Niferche
          </Text>
        </Flex>
      </View>
    </Flex>
  );
};