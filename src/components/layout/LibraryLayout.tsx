// src/components/layout/LibraryLayout.tsx
import { View, Flex, Button } from '@aws-amplify/ui-react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { NavigationHeader } from './navigation-header';
import { BreadcrumbNav } from '../common/BreadcrumbNav';

export const LibraryLayout = () => {
  const location = useLocation();

  // パンくずリストの生成
  const getBreadcrumbItems = () => {
    const paths = location.pathname.split('/').filter(Boolean);
    return [
      { label: 'Library', path: '/library' },
      ...paths.slice(1).map((path, index) => ({
        label: path.charAt(0).toUpperCase() + path.slice(1),
        path: '/' + paths.slice(0, index + 2).join('/')
      }))
    ];
  };

  return (
    <Flex direction="column" height="100vh" width="100vw">
      <View
        position="fixed"
        top="0"
        left="0"
        right="0"
        style={{ 
          zIndex: 1000,
          borderBottom: '1px solid var(--amplify-colors-border-primary)',
          backgroundColor: 'var(--amplify-colors-background-primary)'
        }}
      >
        <NavigationHeader />
      </View>

      <View height="60px" />
      
      <BreadcrumbNav items={getBreadcrumbItems()} />

      <View
        as="main"
        flex="1"
        overflow="auto"
        backgroundColor="background.secondary"
        padding={{ base: 'medium', large: 'large' }}
        style={{
          background: `
            linear-gradient(rgba(0,0,0,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.02) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}
      >
        <View
          maxWidth="1200px"
          margin="0 auto"
          padding={{ base: 'medium', large: 'large' }}
          style={{
            backgroundColor: 'var(--amplify-colors-background-primary)',
            borderRadius: 'var(--amplify-radii-medium)',
            boxShadow: 'var(--amplify-shadows-small)'
          }}
        >
          <Outlet />
        </View>
      </View>

      <View
        as="footer"
        backgroundColor="background.primary"
        padding="small"
        style={{
          borderTop: '1px solid var(--amplify-colors-border-primary)'
        }}
      >
        <Flex
          direction="row"
          alignItems="center"
          justifyContent="center"
          gap="small"
          height="40px"
        >
          <Button
            as={Link}
            to="/library/mainstory"
            variation="link"
            size="small"
          >
            メインストーリー
          </Button>
          <View
            backgroundColor="border.primary"
            width="1px"
            height="20px"
            margin="0 8px"
          />
          <Button
            as={Link}
            to="/library/sidestory"
            variation="link"
            size="small"
          >
            サイドストーリー
          </Button>
        </Flex>
      </View>
    </Flex>
  );
};