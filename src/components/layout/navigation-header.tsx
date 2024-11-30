// src/components/layout/NavigationHeader.tsx
import { Flex,Button,Menu,MenuItem,
  View,Link as AmplifyLink} from '@aws-amplify/ui-react';
import { Link } from 'react-router-dom';
// ナビゲーション項目の型定義
interface NavItem {
  label: string;
  path: string;
  children?: NavItem[];
}

// ナビゲーション構造の定義
const navigation: NavItem[] = [{
    label: 'はじめに',
    path: '/about'
  },{
    label: '理念',
    path: '/niferche/philosophy'
  },{
    label: 'Laboratory',
    path: '/laboratory',
    children: [
      { label: 'About', path: '/laboratory/about' },
      { label: 'Main Story', path: '/laboratory/mainstory' },
      { label: 'Side Story', path: '/laboratory/sidestory' }
    ]
  },{
    label: '設定資料集',
    path: '/materials',
    children: [
      { label: '共通設定', path: '/materials/common' },
      { label: 'Quxe', path: '/materials/quxe' },
      { label: 'Hodemei', path: '/materials/hodemei' },
      { label: 'Alsarejia', path: '/materials/alsarejia' }
    ]
  },
  {
    label: 'Gallery',
    path: '/gallery'
  }
];

export const NavigationHeader = () => {

  const renderMenuItem = (item: NavItem) => {
    if (item.children) {
      return (
        <Menu 
          key={item.path}
          trigger={
            <Button variation="link">
              {item.label}
            </Button>
          }
        >
          {item.children.map((child) => (
            <MenuItem key={child.path}>
              <Link to={child.path} style={{ textDecoration: 'none', color: 'inherit' }}>
                {child.label}
              </Link>
            </MenuItem>
          ))}
        </Menu>
      );
    }

    return (
      <Link key={item.path} to={item.path} style={{ textDecoration: 'none' }}>
        <Button variation="link">
          {item.label}
        </Button>
      </Link>
    );
  };

  return (
    <View
      backgroundColor="background.primary"
      borderColor="border.primary"
      position="sticky"
      top={0}
    >
      <Flex
        as="nav"
        padding="1rem"
        justifyContent="space-between"
        alignItems="center"
        maxWidth="1200px"
        margin="0 auto"
      >
        {/* ロゴ / ホームリンク */}
        <Link to="/" style={{ textDecoration: 'none' }}>
          <AmplifyLink color="font.primary" fontWeight="bold">
            Project Niferche
          </AmplifyLink>
        </Link>

        {/* ナビゲーションメニュー */}
        <Flex as="ul" gap="1rem" alignItems="center" listStyleType="none">
          {navigation.map(renderMenuItem)}
          <Button
            as={Link}
            to="/signin"
            variation="primary"
          >
            ログイン
          </Button>
        </Flex>
      </Flex>
    </View>
  );
};
