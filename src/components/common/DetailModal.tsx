// src/components/common/DetailModal.tsx
import {
  Card,
  Heading,
  Text,
  Image,
  Flex,
  Button,
  View,
  Badge,
  useTheme,
  Divider,
} from '@aws-amplify/ui-react';

interface DetailData {
  id: string;
  title: string;
  description: string;
  category: string;
  imagePath?: string;
  details?: {
    title: string;
    content: string;
  }[];
  metadata?: Record<string, string>;
  tags?: string[];
}

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: DetailData; // nullを許容しない
  entityType: 'facility' | 'research' | 'idea';
}

export const DetailModal: React.FC<DetailModalProps> = ({
  isOpen,
  onClose,
  data,
  entityType
}) => {
  const { tokens } = useTheme();

  if (!isOpen) return null;

  return (
    <View
      position="fixed"
      top="0"
      left="0"
      right="0"
      bottom="0"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        position: 'fixed',
        zIndex: 1000
      }}
      onClick={onClose}
    >
      <Card
        position="relative"
        maxWidth="800px"
        maxHeight="90vh"
        overflow="auto"
        margin="auto"
        padding={tokens.space.medium}
        backgroundColor={tokens.colors.background.primary}
        style={{
          position: 'relative',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }}
        onClick={e => e.stopPropagation()}
      >
        <Flex direction="column" gap={tokens.space.medium}>
          {data.imagePath && (
            <Image
              src={data.imagePath}
              alt={data.title}
              width="100%"
              height="300px"
              objectFit="cover"
              borderRadius={tokens.radii.medium}
            />
          )}

          <Flex justifyContent="space-between" alignItems="center">
            <Heading level={2}>{data.title}</Heading>
            {entityType && (
              <Badge
                variation={entityType === 'facility' ? 'success' :
                         entityType === 'research' ? 'info' : 'warning'}
              >
                {entityType.charAt(0).toUpperCase() + entityType.slice(1)}
              </Badge>
            )}
          </Flex>

          {data.tags && data.tags.length > 0 && (
            <Flex gap="small" wrap="wrap">
              {data.tags.map(tag => (
                <Badge key={tag}>{tag}</Badge>
              ))}
            </Flex>
          )}

          <Text>{data.description}</Text>

          {data.details && data.details.length > 0 && (
            <>
              <Divider />
              {data.details.map((detail, index) => (
                <Flex key={index} direction="column" gap="small">
                  <Heading level={4}>{detail.title}</Heading>
                  <Text>{detail.content}</Text>
                </Flex>
              ))}
            </>
          )}

          {data.metadata && Object.keys(data.metadata).length > 0 && (
            <View
              backgroundColor={tokens.colors.background.secondary}
              padding={tokens.space.medium}
              borderRadius={tokens.radii.medium}
            >
              {Object.entries(data.metadata).map(([key, value]) => (
                <Flex key={key} justifyContent="space-between" padding="xs">
                  <Text fontWeight="bold">{key}:</Text>
                  <Text>{value}</Text>
                </Flex>
              ))}
            </View>
          )}

          <Flex justifyContent="flex-end">
            <Button onClick={onClose}>閉じる</Button>
          </Flex>
        </Flex>
      </Card>
    </View>
  );
};