// src/components/common/LibraryListViewItem.tsx

import { Flex, Text, Badge, Button } from '@aws-amplify/ui-react';
import { useNavigate } from 'react-router-dom';

interface LibraryListViewItemProps {
  id: string;
  title: string;
  description?: string;
  imagePath?: string;
  category?: string; // 例: "MAGIC", "THEORY"など
  tags?: string[];
  isAvailable?: boolean;
  reference?: string;
  linkTo?: string;
  onClick?: () => void;
}

/**
 * リスト表示用のアイテム。Cardではなく行単位のUIにしているイメージ。
 * 画像サムネイルを左、メイン情報を中央、アクションを右に並べるなどの実装も可。
 */
export const LibraryListViewItem: React.FC<LibraryListViewItemProps> = ({
  id,
  title,
  description,
  isAvailable = true,
  reference,
  linkTo,
  onClick,
  tags = [],
  category,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (!isAvailable) {
      alert('このコンテンツは現在準備中です');
      return;
    }
    if (onClick) {
      onClick();
    }
    if (linkTo) {
      navigate(linkTo);
    }
  };

  return (
    <Flex
      key={id}
      direction="row"
      gap="small"
      alignItems="center"
      justifyContent="space-between"
      padding="1rem"
      backgroundColor="var(--amplify-colors-background-primary)"
      borderRadius="small"
      style={{ cursor: isAvailable ? 'pointer' : 'default' }}
      onClick={handleClick}
    >
      <Flex direction="column" gap="xsmall">
        <Text fontWeight="bold">{title}</Text>
        {description && (
          <Text
            fontSize="small"
            color="font.secondary"
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              maxWidth: '500px',
            }}
          >
            {description}
          </Text>
        )}

        <Flex gap="xsmall" wrap="wrap">
          {category && (
            <Badge variation="info">{category}</Badge>
          )}
          {tags.map((tag) => (
            <Badge variation="warning" key={tag}>
              {tag}
            </Badge>
          ))}
        </Flex>
      </Flex>

      <Flex direction="row" gap="small" alignItems="center">
        {reference && (
          <Text fontSize="xsmall" color="font.tertiary">
            {reference}
          </Text>
        )}
        <Badge variation={isAvailable ? 'success' : 'error'}>
          {isAvailable ? '利用可' : '準備中'}
        </Badge>

        {/* もっと細かいアクションが必要なら、Buttonを置くなど */}
        {linkTo && (
          <Button size="small" variation="link">
            詳細へ
          </Button>
        )}
      </Flex>
    </Flex>
  );
};
