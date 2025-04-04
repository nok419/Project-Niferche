import { useEffect, useState } from 'react';
import { Card, Image, Text, Heading, Flex, Button, View, Loader } from '@aws-amplify/ui-react';
import { MockStorageService } from '../../services/mockStorage';

interface ContentDisplayProps {
  path: string;
  type: 'image' | 'text' | 'novel';
  title?: string;
  description?: string;
  fallbackImage?: string;
  pagination?: {
    currentPage: number;
    onPageChange: (page: number) => void;
    totalPages?: number;
  };
}

export const ContentDisplay: React.FC<ContentDisplayProps> = ({
  path,
  type,
  title,
  description,
  fallbackImage = '/images/fallback.jpg',
  pagination
}) => {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageLoadError, setImageLoadError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadContent = async () => {
      try {
        setLoading(true);
        setError(null);
        setImageLoadError(false);

        if (type === 'image') {
          const url = await MockStorageService.getImage(path);
          if (isMounted) setContent(url);
        } else {
          const text = await MockStorageService.getText(path);
          if (isMounted) setContent(text);
        }
      } catch (err) {
        if (isMounted) {
          setError('コンテンツの読み込みに失敗しました');
          console.error('Error loading content:', err);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadContent();

    return () => {
      isMounted = false;
    };
  }, [path, type]);

  const handleImageError = () => {
    setImageLoadError(true);
    console.warn(`Image load failed for path: ${path}`);
  };

  if (loading) {
    return (
      <Card variation="elevated">
        <Flex justifyContent="center" padding="medium">
          <Loader size="large" />
        </Flex>
      </Card>
    );
  }

  return (
    <Card variation="elevated">
      <Flex direction="column" gap="medium">
        {title && <Heading level={3}>{title}</Heading>}
        {description && <Text>{description}</Text>}
        
        {type === 'image' && (
          <Image
            src={imageLoadError ? fallbackImage : (content || fallbackImage)}
            alt={title || 'Content image'}
            objectFit="cover"
            maxHeight="500px"
            onError={handleImageError}
          />
        )}
        
        {(type === 'text' || type === 'novel') && content && (
          <View padding="medium">
            <Text whiteSpace="pre-wrap">{content}</Text>
          </View>
        )}

        {error && (
          <View backgroundColor="red.10" padding="medium" borderRadius="medium">
            <Text color="red.80">{error}</Text>
          </View>
        )}

        {pagination && (
          <Flex justifyContent="center" gap="small">
            <Button 
              onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
              isDisabled={pagination.currentPage <= 1}
              variation="link"
            >
              前へ
            </Button>
            <Text>
              {pagination.currentPage} / {pagination.totalPages ?? '?'}
            </Text>
            <Button 
              onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
              isDisabled={pagination.totalPages ? pagination.currentPage >= pagination.totalPages : false}
              variation="link"
            >
              次へ
            </Button>
          </Flex>
        )}
      </Flex>
    </Card>
  );
};