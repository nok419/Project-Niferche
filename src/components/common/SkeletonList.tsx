// src/components/common/SkeletonList.tsx
import React from 'react';
import { Flex, View } from '@aws-amplify/ui-react';

interface SkeletonListProps {
  count?: number; // 生成するスケルトン数
}

export const SkeletonList: React.FC<SkeletonListProps> = ({ count = 5 }) => {
  return (
    <Flex direction="column" gap="small">
      {Array.from({ length: count }).map((_, i) => (
        <View
          key={i}
          backgroundColor="var(--amplify-colors-background-tertiary)"
          height="80px"
          borderRadius="small"
          // アニメーション例
          style={{ animation: 'skeleton-loading 1s infinite alternate' }}
        />
      ))}

      <style>
        {`
          @keyframes skeleton-loading {
            0% {
              opacity: 0.5;
            }
            100% {
              opacity: 1;
            }
          }
        `}
      </style>
    </Flex>
  );
};
