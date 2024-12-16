// File: src/contexts/BadgeContext.tsx
import { createContext, useContext, ReactNode,useEffect } from 'react';
import { Badge, UserBadgeProgress,BadgeRequirementType } from '../types/badges';
import { useBadges } from '../hooks/useBadges';

interface BadgeContextType {
  // string型をBadgeRequirementTypeに変更
  checkBadgeProgress: (type: BadgeRequirementType, value: string) => Promise<void>;
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
      // BadgeRequirementType.LOGINを使用
      checkBadgeProgress(BadgeRequirementType.LOGIN, 'FIRST_TIME');
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