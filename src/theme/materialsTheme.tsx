// src/theme/materialsTheme.tsx
import { Theme } from '@aws-amplify/ui-react';
import { MaterialsThemeTokens } from '../types/materials';

const themeTokens: MaterialsThemeTokens = {
  colors: {
    background: {
      primary: { value: '#f8f4e9' },
      secondary: { value: '#f5f5f0' },
      tertiary: { value: '#e8e5d5' }
    },
    font: {
      primary: { value: '#2c1810' },
      secondary: { value: '#4a4a4a' },
      tertiary: { value: '#666666' }
    },
    border: {
      primary: { value: '#d4d4c7' },
      secondary: { value: '#bfbfb2' }
    }
  }
};

export const materialsTheme: Theme = {
  name: 'materials-theme',
  tokens: {
    ...themeTokens,
    components: {
      card: {
        backgroundColor: { value: themeTokens.colors.background.secondary.value },
        boxShadow: { value: '2px 2px 4px rgba(0,0,0,0.1)' }
      },
      heading: {
        color: { value: themeTokens.colors.font.primary.value }
      },
      text: {
        color: { value: themeTokens.colors.font.secondary.value }
      }
    },
    fonts: {
      default: {
        variable: { value: 'Georgia, "Times New Roman", serif' },
        static: { value: 'Georgia, "Times New Roman", serif' }
      }
    }
  }
};

export const getThemeTokens = () => themeTokens;