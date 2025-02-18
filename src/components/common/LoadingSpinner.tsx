// src/components/common/LoadingSpinner.tsx
import { Flex, Loader, Text } from '@aws-amplify/ui-react';

interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message }) => {
  return (
    <Flex direction="column" alignItems="center" gap="small" padding="1rem">
      <Loader size="large" />
      {message && <Text>{message}</Text>}
    </Flex>
  );
};

// src/components/common/ErrorAlert.tsx
import React from 'react';
import { Alert } from '@aws-amplify/ui-react';

interface ErrorAlertProps {
  errorMessage: string;
  onDismiss?: () => void;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ errorMessage, onDismiss }) => {
  return (
    <Alert
      variation="error"
      isDismissible
      onDismiss={onDismiss}
    >
      {errorMessage}
    </Alert>
  );
};
