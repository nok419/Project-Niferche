// File: src/contexts/BadgeContext.tsx
import { createContext, useContext, ReactNode,useEffect } from 'react';
import { Badge, UserBadgeProgress } from '../types/badges';
import { useBadges } from '../hooks/useBadges';
interface BadgeContextType {
  checkBadgeProgress: (type: string, value: string) => Promise<void>;
  userBadges: Badge[];
  badgeProgress: UserBadgeProgress[];
  isLoading: boolean;
}

export const BadgeContext = createContext<BadgeContextType | undefined>(undefined);

export const useBadgeContext = () => {
  const context = useContext(BadgeContext);
  if (!context) {
    throw new Error('useBadgeContext must be used within a BadgeProvider');
  }
  return context;
};

interface BadgeProviderProps {
  children: ReactNode;
}

export const BadgeProvider = ({ children }: BadgeProviderProps) => {
    const {
      userBadges,
      badgeProgress,
      isLoading,
      checkBadgeProgress
    } = useBadges();
  
    useEffect(() => {
      // 初回ログイン時のバッジチェック
      checkBadgeProgress('LOGIN', 'FIRST_TIME');
    }, []);
  
    const value = {
      checkBadgeProgress,
      userBadges,
      badgeProgress,
      isLoading
    };
  
    return (
      <BadgeContext.Provider value={value}>
        {children}
      </BadgeContext.Provider>
    );
  };