// File: src/hooks/useBadges.ts
import { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import { Badge, UserBadgeProgress } from '../types/badges';
import type { Schema } from '../../amplify/data/resource';

export const useBadges = () => {
  const client = generateClient<Schema>();
  const [userBadges, setUserBadges] = useState<Badge[]>([]);
  const [badgeProgress, setBadgeProgress] = useState<UserBadgeProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const checkBadgeProgress = async (type: string, value: string) => {
    try {
      const badge = await client.models.Badge.list({
        filter: {
          requirementType: { eq: type },
          requirement: { eq: value }
        }
      });

      if (badge.data.length > 0) {
        // バッジ進捗の更新処理
        const progressUpdate = await client.models.BadgeProgress.update({
          id: `${badge.data[0].id}`,
          progress: 100,
          isCompleted: true,
          completedAt: new Date().toISOString()
        });

        if (progressUpdate.data) {
          // 進捗状態を更新
          setBadgeProgress(prev => 
            prev.map(p => 
              p.badgeId === badge.data[0].id ? progressUpdate.data : p
            )
          );
        }
      }
    } catch (error) {
      console.error('Error checking badge progress:', error);
    }
  };

  useEffect(() => {
    const loadBadges = async () => {
      try {
        setIsLoading(true);
        const badgesResult = await client.models.Badge.list({});
        const progressResult = await client.models.BadgeProgress.list({});
        
        setUserBadges(badgesResult.data);
        setBadgeProgress(progressResult.data);
      } catch (error) {
        console.error('Error loading badges:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBadges();
  }, []);

  return {
    userBadges,
    badgeProgress,
    isLoading,
    checkBadgeProgress
  };
};