// src/contexts/BadgeContext.tsx
import { createContext, useContext, ReactNode, useEffect } from 'react';
import { Badge, BadgeProgress, BadgeRequirementType } from '../types/badges';
import { useBadges } from '../hooks/useBadges';
import { ApiError } from '../types/common';

interface BadgeContextType {
  checkBadgeProgress: (type: BadgeRequirementType, value: string) => Promise<void>;
  userBadges: Badge[];
  badgeProgress: BadgeProgress[];
  isLoading: boolean;
  error: ApiError | null;
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
    error,
    checkBadgeProgress
  } = useBadges();

  useEffect(() => {
    // ログイン時のバッジ進捗チェック
    checkBadgeProgress(BadgeRequirementType.LOGIN, 'FIRST_TIME');
  }, []);

  const value = {
    checkBadgeProgress,
    userBadges,
    badgeProgress,
    isLoading,
    error
  };

  return (
    <BadgeContext.Provider value={value}>
      {children}
    </BadgeContext.Provider>
  );
};