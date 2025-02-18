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

/**
 * ▼ Amplify UI の Badge は variation に
 *    'info' | 'error' | 'warning' | 'success'
 *  のみを指定可能です。
 */
type EntityType = 'facility' | 'research' | 'idea' | 'story' | 'material';

// あるいは、今後さらに追加したいなら下記のようにまとめてもOK
// export type BadgeVariationType = 'info' | 'error' | 'warning' | 'success';

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
  data: DetailData;
  entityType: EntityType;  
}

export const DetailModal: React.FC<DetailModalProps> = ({
  isOpen,
  onClose,
  data,
  entityType
}) => {
  const { tokens } = useTheme();

  // ◆ entityType から Badge の variation を決定する関数
  const getBadgeVariation = (type: EntityType) => {
    switch (type) {
      case 'facility':
        return 'success';   // 緑
      case 'research':
        return 'info';      // 青
      case 'idea':
        return 'warning';   // 黄
      case 'story':
        return 'info';      // (お好みで)
      case 'material':
        return 'success';   // (お好みで)
      default:
        return 'info';      // どれにも該当しないとき
    }
  };

  // モーダルの表示/非表示
  if (!isOpen) return null;

  return (
    // ※ `inset="0"` は使えないので top="0" left="0" ... 等で代用
    <View
      position="fixed"
      top="0"
      left="0"
      right="0"
      bottom="0"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1000,
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
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
        // カード領域のクリックはモーダルを閉じないよう stopPropagation
        onClick={(e) => e.stopPropagation()}
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

            {/* Badge の variation に "neutral" や "default" は不可。 */}
            <Badge variation={getBadgeVariation(entityType)}>
              {entityType.charAt(0).toUpperCase() + entityType.slice(1)}
            </Badge>
          </Flex>

          {data.tags && data.tags.length > 0 && (
            <Flex gap="small" wrap="wrap">
              {data.tags.map(tag => (
                <Badge key={tag} variation="info">
                  {tag}
                </Badge>
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

          {data.metadata && (
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
