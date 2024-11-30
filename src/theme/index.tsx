import { Theme } from '@aws-amplify/ui-react';

export const theme: Theme = {
  name: 'niferche-theme',
  tokens: {
    colors: {
      // 研究所をイメージした洗練された配色
      brand: {
        primary: { value: '#2D3142' },   // メインカラー：深いネイビー
        secondary: { value: '#4F5D75' }, // サブカラー：グレイッシュブルー
        accent: { value: '#7796CB' }     // アクセント：ライトブルー
      },
      background: {
        primary: { value: '#FFFFFF' },   // 白背景
        secondary: { value: '#F7F9FC' }, // うっすらとしたブルーグレー
        tertiary: { value: '#EEF2F6' }   // より濃いブルーグレー
      },
      font: {
        primary: { value: '#2D3142' },   // 濃色文字
        secondary: { value: '#4F5D75' }, // やや薄い文字
        accent: { value: '#7796CB' }     // アクセント文字
      }
    },
    space: {
      small: { value: '0.75rem' },
      medium: { value: '1rem' },
      large: { value: '1.5rem' },
      xl: { value: '2rem' },
      xxl: { value: '3rem' }
    },
    fonts: {
      default: {
        variable: { value: '"Noto Sans JP Variable", sans-serif' },
        static: { value: '"Noto Sans JP", sans-serif' }
      }
    },
    components: {
      card: {
        backgroundColor: { value: '{colors.background.primary}' },
        borderRadius: { value: '8px' },
        boxShadow: { value: '0 2px 4px rgba(45, 49, 66, 0.1)' }
      },
      heading: {
        color: { value: '{colors.font.primary}' }
      },
      text: {
        color: { value: '{colors.font.secondary}' }
      },
      button: {
        primary: {
          backgroundColor: { value: '{colors.brand.primary}' },
          color: { value: 'white' }
        },
        }
      }
    }
  }
;