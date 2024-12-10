// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Amplify } from 'aws-amplify';
import { HelmetProvider } from 'react-helmet-async';
import '@aws-amplify/ui-react/styles.css';
import App from './App';
import type { ResourcesConfig } from 'aws-amplify';

// Amplifyの設定を型安全に定義
const getAmplifyConfig = (): ResourcesConfig => ({
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_USER_POOL_ID || '',
      userPoolClientId: import.meta.env.VITE_USER_POOL_CLIENT_ID || '',
      signUpVerificationMethod: 'code',
    }
  },
  Storage: {
    S3: {
      region: import.meta.env.VITE_AWS_REGION || 'ap-northeast-1',
      bucket: import.meta.env.VITE_STORAGE_BUCKET || '',
    }
  }
});

// 開発環境とビルド環境の両方で動作するように条件分岐
const configureAmplify = async () => {
  try {
    if (import.meta.env.DEV) {
      // 開発環境では amplify_outputs.json を読み込む
      const outputs = await import('../amplify_outputs.json');
      Amplify.configure(outputs.default);
    } else {
      // 本番環境では環境変数から設定を読み込む
      Amplify.configure(getAmplifyConfig());
    }
    console.log('Amplify configuration loaded successfully');
  } catch (error) {
    console.warn('Using fallback configuration:', error);
    // エラー時は環境変数の設定を使用
    Amplify.configure(getAmplifyConfig());
  }
};

configureAmplify();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>
);