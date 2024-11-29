// src/theme/tokens.ts
export const tokens = {
  colors: {
    font: {
      primary: { value: '{colors.neutral.100}' },
      secondary: { value: '{colors.neutral.80}' },
      tertiary: { value: '{colors.neutral.60}' }
    },
    background: {
      primary: { value: '{colors.white}' },
      secondary: { value: '{colors.neutral.10}' },
      tertiary: { value: '{colors.neutral.20}' }
    },
    border: {
      primary: { value: '{colors.neutral.20}' },
      secondary: { value: '{colors.neutral.40}' }
    }
  },
  space: {
    small: { value: '0.5rem' },
    medium: { value: '1rem' },
    large: { value: '1.5rem' }
  },
  components: {
    navigation: {
      height: { value: '4rem' },
      fontSize: { value: '1rem' }
    }
  }
};