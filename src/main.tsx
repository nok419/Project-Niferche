import React from 'react';
import ReactDOM from 'react-dom/client';
import { Amplify } from 'aws-amplify';
import { HelmetProvider } from 'react-helmet-async';
import '@aws-amplify/ui-react/styles.css';
import App from './App';

const config = await import('../amplify_outputs.json');
Amplify.configure(config.default);

const loadConfig = async () => {
  try {
    const awsconfig = await import('../amplify_outputs.json');
    
    // まずそのままの設定で試してみる
    Amplify.configure(awsconfig.default);
    
    console.log('Loaded config:', awsconfig.default);
  } catch (error) {
    console.error('Error loading amplify config:', error);
  }
};

loadConfig();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>
);