// File: src/hooks/useBadges.ts
import { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import { Badge, UserBadgeProgress, BadgeRequirementType } from '../types/badges';
import type { Schema } from '../../amplify/data/resource';

const transformToBadge = (data: any): Badge => ({
  id: data.id,
  name: data.name,
  description: data.description,
  iconUrl: data.iconUrl || '/images/badges/default.png',
  condition: data.requirement,
  requirementType: data.requirementType as BadgeRequirementType,
  requirement: data.requirement,
  priority: data.priority,
  isSecret: data.isSecret,
  createdAt: data.createdAt,
  updatedAt: data.updatedAt
});

export const useBadges = () => {
  const client = generateClient<Schema>();
  const [userBadges, setUserBadges] = useState<Badge[]>([]);
  const [badgeProgress, setBadgeProgress] = useState<UserBadgeProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const checkBadgeProgress = async (type: BadgeRequirementType, value: string) => {
    try {
      const badge = await client.models.Badge.list({
        filter: {
          requirementType: { eq: type },
          requirement: { eq: value }
        }
      });

      if (badge.data.length > 0) {
        const progressUpdate = await client.models.BadgeProgress.update({
          id: badge.data[0].id,
          progress: 100,
          isCompleted: true,
          completedAt: new Date().toISOString(),
          lastUpdatedAt: new Date().toISOString()
        });

        // null チェックを追加
        if (progressUpdate?.data) {
          const updatedProgress: UserBadgeProgress = {
            id: progressUpdate.data.id ?? crypto.randomUUID(),
            userId: progressUpdate.data.userId,
            badgeId: progressUpdate.data.badgeId,
            progress: progressUpdate.data.progress,
            isCompleted: progressUpdate.data.isCompleted,
            completedAt: progressUpdate.data.completedAt || null,
            lastUpdatedAt: progressUpdate.data.lastUpdatedAt,
            createdAt: progressUpdate.data.createdAt,
            updatedAt: progressUpdate.data.updatedAt
          };

          setBadgeProgress(prev => 
            prev.map(p => 
              p.badgeId === badge.data[0].id ? updatedProgress : p
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
        
        if (badgesResult?.data) {
          const transformedBadges = badgesResult.data.map(transformToBadge);
          setUserBadges(transformedBadges);
        }

        if (progressResult?.data) {
          const transformedProgress = progressResult.data.map(item => ({
            id: item.id,
            userId: item.userId,
            badgeId: item.badgeId,
            progress: item.progress,
            isCompleted: item.isCompleted,
            completedAt: item.completedAt || null,
            lastUpdatedAt: item.lastUpdatedAt,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt
          })) as UserBadgeProgress[];
          
          setBadgeProgress(transformedProgress);
        }
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