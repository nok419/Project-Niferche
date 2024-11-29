import { Theme } from '@aws-amplify/ui-react';

export const laboratoryTheme: Theme = {
  name: 'laboratory-theme',
  tokens: {
    colors: {
      background: {
        primary: '#1E293B',   // より落ち着いたダークブルー
        secondary: '#2D3748', // 少し明るめの背景色
        tertiary: '#4A5568',  // アクセントとして使用
      },
      font: {
        primary: '#e94560',
        secondary: '#ffffff',
        tertiary: '#cccccc',
        interactive: '#e94560',
      },
      border: {
        primary: '#e94560',
        secondary: '#16213e',
      },
    },
    components: {
      button: {
        primary: {
          backgroundColor: '#e94560',
          color: '#ffffff',
          _hover: {
            backgroundColor: '#cf3d54',
          },
        },
      },
      card: {
        backgroundColor: '#16213e',
        borderColor: '#e94560',
      },
    },
  },
};