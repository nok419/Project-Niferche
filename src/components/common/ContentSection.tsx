// src/components/common/ContentSection.tsx
import { View, Heading, Text, Flex } from '@aws-amplify/ui-react';

interface ContentSectionProps {
  title: string;
  description?: string;
  variant?: 'default' | 'laboratory' | 'materials';
  children: React.ReactNode;
}

export const ContentSection = ({ 
  title, 
  description, 
  variant = 'default',
  children 
}: ContentSectionProps) => {
  const sectionStyles = {
    default: {
      padding: '2rem',
      backgroundColor: 'background.primary',
      borderRadius: '8px',
    },
    laboratory: {
      padding: '2rem',
      backgroundColor: 'rgba(30, 41, 59, 0.8)',
      borderRadius: '4px',
      border: '1px solid var(--amplify-colors-border-primary)',
    },
    materials: {
      padding: '1.5rem',
      backgroundColor: 'background.secondary',
      borderRadius: '2px',
    }
  };

  return (
    <View
      style={sectionStyles[variant]}
      marginBottom="2rem"
    >
      <Flex direction="column" gap="medium">
        <Heading level={2}>{title}</Heading>
        {description && <Text>{description}</Text>}
        {children}
      </Flex>
    </View>
  );
};