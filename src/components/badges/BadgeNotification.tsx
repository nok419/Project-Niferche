// File: src/components/badges/BadgeNotification.tsx
import { Alert, Flex, Image, Text } from '@aws-amplify/ui-react';
import { Badge } from '../../types/badges';

interface BadgeNotificationProps {
  badge: Badge;
  onClose: () => void;
}

export const BadgeNotification = ({ badge, onClose }: BadgeNotificationProps) => {
  return (
    <Alert
      variation="info"
      isDismissible={true}
      hasIcon={true}
      onDismiss={onClose}
    >
      <Flex direction="row" alignItems="center" gap="medium">
        <Image
          alt={badge.name}
          src={badge.iconUrl}
          width="32px"
          height="32px"
        />
        <Flex direction="column">
          <Text variation="primary" fontWeight="bold">
            新しいバッジを獲得しました！
          </Text>
          <Text>{badge.name}</Text>
          <Text variation="tertiary" fontSize="small">
            {badge.description}
          </Text>
        </Flex>
      </Flex>
    </Alert>
  );
};