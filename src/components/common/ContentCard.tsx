import { Card, Flex, Text, Heading, Image } from '@aws-amplify/ui-react';
import { useNavigate } from 'react-router-dom';

interface ContentCardProps {
  title: string;
  description?: string;
  imagePath?: string;
  linkTo: string;
  onClick?: () => void;
  size?: 'small' | 'medium' | 'large'; // サイズ設定を追加
  variant?: 'story' | 'material' | 'info'; // 用途別のスタイル
}

export const ContentCard: React.FC<ContentCardProps> = ({
  title,
  description,
  imagePath,
  linkTo,
  onClick
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    navigate(linkTo);
  };

  return (
    <Card
      variation="elevated"
      padding="medium"
      borderRadius="medium"
      onClick={handleClick}
      style={{
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      }}
      className="clickable-card"
    >
      <Flex direction="column" gap="medium">
        {imagePath && (
          <Image
            src={imagePath}
            alt={title}
            objectFit="cover"
            width="100%"
            height="200px"
            borderRadius="medium"
          />
        )}
        
        <Heading level={3}>{title}</Heading>
        
        {description && (
          <Text>{description}</Text>
        )}
      </Flex>
    </Card>
  );
};