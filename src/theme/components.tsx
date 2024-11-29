// src/theme/components.ts
import { Theme } from '@aws-amplify/ui-react';

export const components = {
  button: {
    primary: {
      backgroundColor: { value: '{colors.brand.primary}' },
      color: { value: '{colors.white}' }
    }
  },
  menu: {
    backgroundColor: { value: '{colors.background.primary}' },
    borderColor: { value: '{colors.border.primary}' }
  }
};