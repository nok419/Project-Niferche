// src/components/user/UserMenu.tsx
import { 
  Menu, 
  MenuItem, 
  Button, 
  Badge, 
  Flex 
} from '@aws-amplify/ui-react';
import { Link } from 'react-router-dom';
// Replace the old import:
// import { useAuth } from '../auth/AuthContext';
import { useSession } from '../../contexts/SessionContext';

export const UserMenu = () => {
  // Destructure from the new session context
  const { user, signOut } = useSession();

  return (
    <Menu 
      trigger={
        <Button variation="menu">
          <Flex alignItems="center" gap="small">
            {user?.username}
            {user?.attributes?.['custom:role'] === 'admin' && (
              <Badge variation="info">管理者</Badge>
            )}
          </Flex>
        </Button>
      }
    >
      <MenuItem>
        <Link to="/profile" style={{ textDecoration: 'none', color: 'inherit' }}>
          プロフィール
        </Link>
      </MenuItem>
      <MenuItem>
        <Link to="/favorites" style={{ textDecoration: 'none', color: 'inherit' }}>
          お気に入り
        </Link>
      </MenuItem>
      {user?.attributes?.['custom:role'] === 'admin' && (
        <MenuItem>
          <Link to="/admin" style={{ textDecoration: 'none', color: 'inherit' }}>
            管理画面
          </Link>
        </MenuItem>
      )}
      <MenuItem onClick={signOut}>
        ログアウト
      </MenuItem>
    </Menu>
  );
};
