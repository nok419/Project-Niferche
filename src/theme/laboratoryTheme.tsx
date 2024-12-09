// src/theme/laboratoryTheme.tsx
import { Theme } from '@aws-amplify/ui-react';

export const laboratoryTheme: Theme = {
  name: 'laboratory-theme',
  tokens: {
    colors: {
      background: {
        primary: '#1a1f2e',
        secondary: '#242938',
        tertiary: '#2d334a',
      },
      font: {
        primary: '#e2678a',
        secondary: '#eaeaea',
        tertiary: '#b8b8b8',
        interactive: '#ff8fa3',
      },
      border: {
        primary: '#e2678a',
        secondary: '#2d334a',
      },
      accent: {
        purple: '#9f7aea',
        blue: '#4299e1',
        pink: '#ed64a6'
      }
    },
    components: {
      button: {
        primary: {
          backgroundColor: { value: '#e2678a' },
          color: { value: '#ffffff' },
          // hover状態はスタイルで制御
        },
      },
      card: {
        backgroundColor: { value: '#242938' },
        borderColor: { value: '#2d334a' },
        // hover状態はスタイルで制御
      },
      heading: {
        color: { value: '#e2678a' },
        // その他のスタイルはCSSで制御
      },
    },
    shadows: {
      small: { value: '0 2px 4px rgba(0, 0, 0, 0.1)' },
      medium: { value: '0 4px 6px rgba(0, 0, 0, 0.1)' },
      large: { value: '0 8px 12px rgba(0, 0, 0, 0.1)' },
    },
  },
};