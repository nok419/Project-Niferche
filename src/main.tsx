import React from 'react';
import ReactDOM from 'react-dom/client';
import { Amplify } from 'aws-amplify';
import { HelmetProvider } from 'react-helmet-async';
import '@aws-amplify/ui-react/styles.css';
import App from './App';

// 基本設定
const defaultConfig = {
  Auth: {
    region: import.meta.env.VITE_AWS_REGION || 'ap-northeast-1',
    mandatorySignIn: false,
  }
};

// Amplify初期化関数
const initializeApp = async () => {
  try {
    // configのロードと初期化
    const config = await import('../amplify_outputs.json');
    Amplify.configure({
      ...defaultConfig,
      ...config.default,
    });

    // アプリケーションのレンダリング
    const root = ReactDOM.createRoot(
      document.getElementById('root') as HTMLElement
    );

    root.render(
      <React.StrictMode>
        <HelmetProvider>
          <App />
        </HelmetProvider>
      </React.StrictMode>
    );

  } catch (error) {
    console.error('Initialization error:', error);
    // エラー時のフォールバックUI
    const rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.innerHTML = `
        <div style="padding: 20px; text-align: center;">
          <h2>アプリケーションの初期化中にエラーが発生しました</h2>
          <p>ページを再読み込みするか、しばらく経ってから再度アクセスしてください。</p>
        </div>
      `;
    }
  }
};

initializeApp();