// src/components/common/LoadingSpinner.tsx
import { Flex, Loader, Text } from '@aws-amplify/ui-react';
import './LoadingState.css';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
  fullPage?: boolean;
  overlay?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message, 
  size = 'medium', 
  fullPage = false,
  overlay = false
}) => {
  const containerClasses = [
    'loading-spinner-container',
    fullPage ? 'full-page' : '',
    overlay ? 'overlay' : ''
  ].filter(Boolean).join(' ');

  return (
    <Flex 
      direction="column" 
      alignItems="center" 
      justifyContent="center"
      gap="small" 
      padding="1rem"
      className={containerClasses}
    >
      <Loader 
        size={size} 
        className={`loading-spinner-${size}`}
        aria-label="読み込み中"
      />
      {message && (
        <Text 
          className="loading-message"
          aria-live="polite"
        >
          {message}
        </Text>
      )}
    </Flex>
  );
};
