import React from 'react';
import ReactDOM from 'react-dom/client';
import { Amplify } from 'aws-amplify';
import { HelmetProvider } from 'react-helmet-async';
import '@aws-amplify/ui-react/styles.css';
import App from './App';

// aws-exportsの存在を確認してからインポート
let awsconfig;
try {
  awsconfig = require('../aws-exports').default;
  console.log('AWS Config loaded:', awsconfig);
} catch (error) {
  console.error('Error loading aws-exports:', error);
  awsconfig = {};
}

// Amplify設定
try {
  Amplify.configure(awsconfig);
  console.log('Amplify configured successfully');
} catch (error) {
  console.error('Error configuring Amplify:', error);
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>
);