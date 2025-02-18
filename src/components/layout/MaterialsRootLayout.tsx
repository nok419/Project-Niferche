// File: src/components/layout/MaterialsRootLayout.tsx
import { View, Flex, Button } from '@aws-amplify/ui-react';
import { NavigationHeader } from './navigation-header';
import { Link, Outlet } from 'react-router-dom';

/**
 * こちらは「React Router」のRoute Outletを持つルート用レイアウト:
 *   <Route element={<MaterialsRootLayout />}>
 *     <Route path="/materials/about" ... />
 *     ...
 *   </Route>
 *
 * 一方、"components/materials/MaterialsLayout.tsx" は
 * 各ページで「設定資料タイトルや説明」を表示するデザイン用ラッパコンポーネント
 * (props: { title, description, children }) として使うイメージ。
 */

export const MaterialsRootLayout = () => {
  return (
    <Flex direction="column" height="100vh" width="100vw">
      <View
        position="fixed"
        top="0"
        left="0"
        right="0"
        style={{ zIndex: 1000 }}
        backgroundColor="background.tertiary"
      >
        <NavigationHeader />
      </View>

      <View height="60px" />
      
      <View
        as="main"
        flex="1"
        overflow="auto"
        backgroundColor="background.tertiary"
        padding={{ base: 'medium', large: 'large' }}
      >
        <Outlet />
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
            <View fontSize="small">
              &copy; 2024 Project Niferche. All rights reserved.
            </View>
            <View
              backgroundColor="border.primary"
              width="1px"
              height="20px"
              margin="0 8px"
            />
            <Button
              as={Link}
              to="/niferche/rights"
              variation="link"
              size="small"
              padding="0"
            >
              権利情報
            </Button>
            <Button
              as={Link}
              to="/terms"
              variation="link"
              size="small"
              padding="0"
            >
              利用規約
            </Button>
          </Flex>
        </View>
    </Flex>
  );
};
