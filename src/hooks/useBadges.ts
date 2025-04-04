// src/hooks/useBadges.ts
import { useState, useEffect, useCallback } from 'react';
import { generateClient } from 'aws-amplify/api';
import { Badge, BadgeProgress, BadgeRequirementType, transformToBadge, transformToBadgeProgress } from '../types/badges';
import { ApiError } from '../types/common';
import type { Schema } from '../../amplify/data/resource';

export const useBadges = () => {
  const client = generateClient<Schema>();
  const [userBadges, setUserBadges] = useState<Badge[]>([]);
  const [badgeProgress, setBadgeProgress] = useState<BadgeProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  // バッジ進捗確認関数
  const checkBadgeProgress = useCallback(async (type: BadgeRequirementType, value: string) => {
    try {
      // 特定の条件に一致するバッジを検索
      const badge = await client.models.Badge.list({
        filter: {
          requirementType: { eq: type },
          requirement: { eq: value }
        }
      });

      if (badge.data.length > 0) {
        // 既存の進捗を確認（ない場合は新規作成）
        const badgeId = badge.data[0].id;
        const existingProgress = badgeProgress.find(p => p.badgeId === badgeId);
        
        if (existingProgress) {
          // 既に完了済みなら何もしない
          if (existingProgress.isCompleted) {
            return;
          }
          
          // 進捗を更新
          const progressUpdate = await client.models.BadgeProgress.update({
            id: existingProgress.id,
            progress: 100,
            isCompleted: true,
            completedAt: new Date().toISOString(),
            lastUpdatedAt: new Date().toISOString()
          });

          if (progressUpdate?.data) {
            const updatedProgress = transformToBadgeProgress(progressUpdate.data);
            setBadgeProgress(prev => 
              prev.map(p => p.id === updatedProgress.id ? updatedProgress : p)
            );
          }
        } else {
          // 新規進捗を作成
          const userId = (await client.models.UserProfile.list({ limit: 1 })).data[0]?.userId || 'anonymous';
          
          const newProgress = await client.models.BadgeProgress.create({
            userId,
            badgeId,
            progress: 100,
            isCompleted: true,
            completedAt: new Date().toISOString(),
            lastUpdatedAt: new Date().toISOString()
          });

          if (newProgress?.data) {
            const createdProgress = transformToBadgeProgress(newProgress.data);
            setBadgeProgress(prev => [...prev, createdProgress]);
          }
        }
      }
    } catch (e) {
      const apiError = e as ApiError;
      setError({
        name: apiError.name || 'Error',
        message: apiError.message || 'Failed to check badge progress',
        code: apiError.code,
        stack: apiError.stack
      });
      console.error('Error checking badge progress:', e);
    }
  }, [client, badgeProgress]);

  // バッジデータ読み込み
  useEffect(() => {
    const loadBadges = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // バッジと進捗を並行して取得
        const [badgesResult, progressResult] = await Promise.all([
          client.models.Badge.list({}),
          client.models.BadgeProgress.list({})
        ]);
        
        if (badgesResult?.data) {
          const transformedBadges = badgesResult.data.map(transformToBadge);
          setUserBadges(transformedBadges);
        }

        if (progressResult?.data) {
          const transformedProgress = progressResult.data.map(transformToBadgeProgress);
          setBadgeProgress(transformedProgress);
        }
      } catch (e) {
        const apiError = e as ApiError;
        setError({
          name: apiError.name || 'Error',
          message: apiError.message || 'Failed to load badges',
          code: apiError.code,
          stack: apiError.stack
        });
        console.error('Error loading badges:', e);
      } finally {
        setIsLoading(false);
      }
    };

    loadBadges();
  }, [client]);

  return {
    userBadges,
    badgeProgress,
    isLoading,
    error,
    checkBadgeProgress
  };
};