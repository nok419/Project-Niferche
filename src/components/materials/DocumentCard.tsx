// src/components/materials/DocumentCard.tsx
import { Card, Text, Heading, Badge, Flex } from '@aws-amplify/ui-react';
import { Link } from 'react-router-dom';
import { MaterialDocument } from '../../types/materials';

interface DocumentCardProps extends MaterialDocument {}

export const DocumentCard = ({
  id,
  title,
  description,
  category,
  reference,
  isAvailable,
  linkTo,
  variant = 'document'
}: DocumentCardProps) => {
  return (
    <Card
      key={id}
      variation="elevated"
      padding="1.5rem"
      backgroundColor="#f5f5f0"
      borderRadius="medium"
      className={`document-card document-card--${variant}`}
    >
      <Link 
        to={linkTo || '#'} 
        style={{ textDecoration: 'none', color: 'inherit' }}
        onClick={(e) => {
          if (!isAvailable) {
            e.preventDefault();
            alert('このコンテンツは現在準備中です');
          }
        }}
      >
        <Flex direction="column" gap="medium">
          <Flex justifyContent="space-between" alignItems="center">
            <Badge variation={isAvailable ? 'success' : 'warning'}>
              {isAvailable ? '閲覧可' : '準備中'}
            </Badge>
            {reference && (
              <Text variation="tertiary" fontSize="small">
                {reference}
              </Text>
            )}
          </Flex>
          
          <Heading level={3}>{title}</Heading>
          <Text>{description}</Text>
          
          <Text variation="tertiary" fontSize="small">
            分類: {category}
          </Text>
        </Flex>
      </Link>
    </Card>
  );
};