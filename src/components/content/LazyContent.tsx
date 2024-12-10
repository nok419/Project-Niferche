// src/components/content/LazyContent.tsx
import { Suspense } from 'react';
import { View, Loader } from '@aws-amplify/ui-react';

export const LazyContent = ({ children }: { children: React.ReactNode }) => {
  return (
    <Suspense 
      fallback={
        <View padding="2rem" textAlign="center">
          <Loader size="large" />
        </View>
      }
    >
      {children}
    </Suspense>
  );
};