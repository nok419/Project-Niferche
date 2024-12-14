// components/common/ErrorBoundary.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { View, Heading, Text } from '@aws-amplify/ui-react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

// エラー表示用のコンポーネント
const ErrorFallback = ({ error }: { error?: Error }) => {
  const navigate = useNavigate();

  React.useEffect(() => {
    // エラーページへリダイレクト
    navigate('/error', { 
      state: { 
        errorMessage: error?.message || 'An unexpected error occurred.'
      }
    });
  }, [error, navigate]);

  // リダイレクト中の表示
  return (
    <View padding="medium" textAlign="center">
      <Heading level={2}>エラーが発生しました</Heading>
      <Text>ページを移動しています...</Text>
    </View>
  );
};