import { useEffect, useState } from 'react';
import { Card, Image, Text, Heading, Flex, View } from '@aws-amplify/ui-react';
import { StorageService } from '../../services/storage';

interface ContentDisplayProps {
  path: string;
  type: 'image' | 'text' | 'novel';
  title?: string;
  description?: string;
}

export const ContentDisplay: React.FC<ContentDisplayProps> = ({
  path,
  type,
  title,
  description
}) => {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        const url = await StorageService.getFileUrl(path);
        setContent(url);
        setError(null);
      } catch (err) {
        setError('コンテンツの読み込みに失敗しました');
        console.error('Error loading content:', err);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [path]);

  if (loading) {
    return <View>Loading...</View>;
  }

  if (error) {
    return <View>{error}</View>;
  }

  return (
    <Card variation="elevated">
      <Flex direction="column" gap="medium">
        {title && (
          <Heading level={3}>{title}</Heading>
        )}
        
        {type === 'image' && content && (
          <Image
            src={content}
            alt={title || 'Content image'}
            objectFit="cover"
            maxHeight="500px"
          />
        )}
        
        {type === 'text' && content && (
          <Text>{content}</Text>
        )}
        
        {type === 'novel' && content && (
          <View padding="medium">
            <Text whiteSpace="pre-wrap">{content}</Text>
          </View>
        )}

        {description && (
          <Text>{description}</Text>
        )}
      </Flex>
    </Card>
  );
};