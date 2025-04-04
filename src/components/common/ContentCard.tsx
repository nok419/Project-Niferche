import { Card, Flex, Text, Heading, Image, View } from '@aws-amplify/ui-react';
import { useNavigate } from 'react-router-dom';
import './ContentCard.css';

interface ContentCardProps {
  title: string;
  description?: string;
  imagePath?: string;
  linkTo?: string;
  onClick?: () => void;
  size?: 'small' | 'medium' | 'large';
  variant?: 'story' | 'material' | 'info';
  footer?: React.ReactNode;
}

export const ContentCard: React.FC<ContentCardProps> = ({
  title,
  description,
  imagePath,
  linkTo,
  onClick,
  size = 'medium',
  variant = 'story',
  footer
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    if (linkTo) {
      navigate(linkTo);
    }
  };

  // サイズに基づく設定
  const getCardStyles = () => {
    switch (size) {
      case 'small':
        return 'content-card-small';
      case 'large':
        return 'content-card-large';
      default:
        return 'content-card-medium';
    }
  };

  // バリアントに基づく設定
  const getVariantStyles = () => {
    switch (variant) {
      case 'material':
        return 'content-card-material';
      case 'info':
        return 'content-card-info';
      default:
        return 'content-card-story';
    }
  };

  return (
    <Card
      variation="elevated"
      padding="medium"
      borderRadius="medium"
      onClick={linkTo || onClick ? handleClick : undefined}
      className={`ContentCard ${getCardStyles()} ${getVariantStyles()} ${(linkTo || onClick) ? 'clickable' : ''}`}
      aria-label={title}
    >
      <Flex direction="column" gap="medium" className="content-card-container">
        {imagePath && (
          <div className="content-card-image-container">
            <Image
              src={imagePath}
              alt={title}
              objectFit="cover"
              width="100%"
              height="auto"
              className="content-card-image"
              borderRadius="medium"
              loading="lazy"
              onError={(e) => {
                // オプション: 画像読み込みエラー時のフォールバック
                if (e && typeof e !== 'string' && 'currentTarget' in e) {
                  (e.currentTarget as HTMLImageElement).src = '/images/fallback.jpg';
                }
              }}
            />
          </div>
        )}
        
        <View className="content-card-content">
          <Heading level={3} className="content-card-title">{title}</Heading>
          
          {description && (
            <Text className="content-card-description">
              {description.length > 120 ? `${description.substring(0, 120)}...` : description}
            </Text>
          )}
        </View>
        
        {footer && (
          <View className="content-card-footer">
            {footer}
          </View>
        )}
      </Flex>
    </Card>
  );
};