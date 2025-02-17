// src/components/common/ErrorAlert.tsx
import React from 'react';
import { Alert } from '@aws-amplify/ui-react';

interface ErrorAlertProps {
  errorMessage: string;
  onDismiss?: () => void;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({
  errorMessage,
  onDismiss,
}) => {
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
