import { useEffect, useState } from 'react';
import { Card, Image, Text, Heading, Flex, Button , View } from '@aws-amplify/ui-react';
import { StorageService } from '../../services/storage';

interface ContentDisplayProps {
  path: string;
  type: 'image' | 'text' | 'novel';
  title?: string;
  description?: string;
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
  pagination
}) => {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        if (type === 'image') {
          const url = await StorageService.getFileUrl(path);
          setContent(url);
        } else {
          const text = await StorageService.getTextContent(path);
          setContent(text);
        }
      } catch (err) {
        setError('コンテンツの読み込みに失敗しました');
        console.error('Error loading content:', err);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [path, type]);

  if (loading) {
    return (
      <Card variation="elevated">
        <Flex justifyContent="center" padding="medium">
          <Text>Loading...</Text>
        </Flex>
      </Card>
    );
  }

  if (error) {
    return (
      <Card variation="elevated">
        <Flex justifyContent="center" padding="medium">
          <Text color="red">{error}</Text>
        </Flex>
      </Card>
    );
  }

  return (
    <Card variation="elevated">
      <Flex direction="column" gap="medium">
        {title && <Heading level={3}>{title}</Heading>}
        
        {type === 'image' && content && (
          <Image
            src={content}
            alt={title || 'Content image'}
            objectFit="cover"
            maxHeight="500px"
          />
        )}
        
        {(type === 'text' || type === 'novel') && content && (
          <View padding="medium">
            <Text whiteSpace="pre-wrap">{content}</Text>
          </View>
        )}
        {pagination && (
          <Flex justifyContent="center" gap="small">
            <Button 
              onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
              isDisabled={pagination.currentPage <= 1 ? true : false} // 明示的にboolean型を指定
            >
              前へ
            </Button>
            <Text>
              {pagination.currentPage} / {pagination.totalPages ?? '?'}
            </Text>
            <Button 
              onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
              isDisabled={pagination.totalPages ? pagination.currentPage >= pagination.totalPages : false}
            >
              次へ
            </Button>
          </Flex>
        )}
      </Flex>
    </Card>
  );
};