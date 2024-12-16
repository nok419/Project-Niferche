import { 
  Flex,
  Button,
  Menu,
  MenuItem,
  View,
  useBreakpointValue,
  Divider
} from '@aws-amplify/ui-react';
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

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
      { label: 'Side Story', path: '/laboratory/sidestory' },
      { label: 'IdeaLibrary', path: '/laboratory/IdeaLibrary' },
      { label: 'FacilityGuide', path: '/laboratory/FacilityGuide' }
    ]
  },{
    label: '設定資料集',
    path: '/materials',
    children: [
      { label: '資料室', path: '/materials/about' },
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
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isMobile = useBreakpointValue({
    base: true,
    medium: false
  });

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  // モバイルメニュー用のコンポーネント
  const MobileMenuItem = ({ item }: { item: NavItem }) => {
    const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
    
    return (
      <View width="100%">
        {item.children ? (
          <View width="100%">
            <Button
              width="100%"
              variation="link"
              onClick={() => setIsSubMenuOpen(!isSubMenuOpen)}
              backgroundColor={isActive(item.path) ? "background.secondary" : "transparent"}
            >
              {item.label}
            </Button>
            {isSubMenuOpen && (
              <View paddingLeft="medium">
                {item.children.map((child) => (
                  <Link
                    key={child.path}
                    to={child.path}
                    style={{ textDecoration: 'none', width: '100%' }}
                    onClick={() => setIsOpen(false)}
                  >
                    <Button
                      width="100%"
                      variation="link"
                      backgroundColor={isActive(child.path) ? "background.secondary" : "transparent"}
                    >
                      {child.label}
                    </Button>
                  </Link>
                ))}
              </View>
            )}
          </View>
        ) : (
          <Link
            to={item.path}
            style={{ textDecoration: 'none', width: '100%' }}
            onClick={() => setIsOpen(false)}
          >
            <Button
              width="100%"
              variation="link"
              backgroundColor={isActive(item.path) ? "background.secondary" : "transparent"}
            >
              {item.label}
            </Button>
          </Link>
        )}
      </View>
    );
  };

  // デスクトップメニュー用のコンポーネント
  const DesktopMenuItem = ({ item }: { item: NavItem }) => {
    if (item.children) {
      return (
        <Menu 
          key={item.path}
          trigger={
            <Button 
              variation="link"
              backgroundColor={isActive(item.path) ? "background.secondary" : "transparent"}
            >
              {item.label}
            </Button>
          }
        >
          {item.children.map((child) => (
            <MenuItem 
              key={child.path}
              backgroundColor={isActive(child.path) ? "background.secondary" : "transparent"}
            >
              <Link 
                to={child.path} 
                style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}
              >
                {child.label}
              </Link>
            </MenuItem>
          ))}
        </Menu>
      );
    }

    return (
      <Link 
        key={item.path} 
        to={item.path} 
        style={{ textDecoration: 'none' }}
      >
        <Button 
          variation="link"
          backgroundColor={isActive(item.path) ? "background.secondary" : "transparent"}
        >
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
      style={{ 
        zIndex: 100,
        height: isMobile ? '50px' : 'var(--header-height)',
        borderBottom: '1px solid var(--amplify-colors-border-primary)'
      }}
    >
      <Flex
        direction="row"
        padding={isMobile ? "0.5rem" : "1rem"}
        justifyContent="space-between"
        alignItems="center"
        maxWidth="1200px"
        margin="0 auto"
      >
        <Link to="/" style={{ textDecoration: 'none' }}>
          <span style={{ 
            color: 'var(--amplify-colors-font-primary)', 
            fontWeight: 'bold',
            fontSize: isMobile ? '1rem' : '1.2rem' 
          }}>
            Project Niferche
          </span>
        </Link>

        {isMobile ? (
          <>
            <Button
              size="small"
              variation="link"
              onClick={() => setIsOpen(!isOpen)}
              style={{
                padding: '0.5rem',
                minWidth: 'auto'
              }}
            >
              ☰
            </Button>
            {isOpen && (
              <View
                position="fixed"
                top="50px"
                left="0"
                right="0"
                bottom="0"
                backgroundColor="background.primary"
                padding="1rem"
                style={{
                  overflowY: 'auto',
                  zIndex: 1000
                }}
              >
                <Flex direction="column" gap="0.5rem">
                  {navigation.map((item) => (
                    <MobileMenuItem key={item.path} item={item} />
                  ))}
                  <Divider />
                  <Link 
                    to="/auth/signin" 
                    style={{ textDecoration: 'none', width: '100%' }}
                    onClick={() => setIsOpen(false)}
                  >
                    <Button width="100%" variation="primary">
                      ログイン
                    </Button>
                  </Link>
                </Flex>
              </View>
            )}
          </>
        ) : (
          <Flex
            direction="row"
            gap="1rem"
            alignItems="center"
          >
            {navigation.map((item) => (
              <DesktopMenuItem key={item.path} item={item} />
            ))}
            <Button
              as={Link}
              to="/auth/signin"
              variation="primary"
            >
              ログイン
            </Button>
          </Flex>
        )}
      </Flex>
    </View>
  );
};