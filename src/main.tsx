// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Amplify } from 'aws-amplify';
import App from './App';

// スタイルのインポート
import './styles/theme.css';
import './styles/global.css';
import '@aws-amplify/ui-react/styles.css';

// Amplify設定の初期化 (configファイルは実際のパスに合わせて調整)
try {
  const config = await import('./amplifyconfiguration').then(module => module.default);
  Amplify.configure(config);
} catch (error) {
  console.warn('Amplify configuration not found or invalid', error);
}

// パフォーマンス監視と最適化のための設定
// メトリクスを収集するためのreportWebVitalsヘルパー
const reportWebVitals = (metric: any) => {
  // DEV環境でのみコンソールに出力
  if (import.meta.env.DEV) {
    console.log(metric);
  } else {
    // 本番環境では必要に応じて分析サービスに送信
  }
};

// アプリケーションのレンダリング - React 19の機能を活用
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// 必要に応じてWeb Vitalsの測定を有効化
// import { onCLS, onFID, onLCP } from 'web-vitals';
// onCLS(reportWebVitals);
// onFID(reportWebVitals);
// onLCP(reportWebVitals);