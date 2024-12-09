// src/components/materials/MaterialsLayout.tsx
import { View, Card, Heading, Text, ThemeProvider } from '@aws-amplify/ui-react';
import { materialsTheme, getThemeTokens } from '../../theme/materialsTheme';
import { ReactNode } from 'react';

interface MaterialsLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
}

export const MaterialsLayout = ({ title, description, children }: MaterialsLayoutProps) => {
  const tokens = getThemeTokens();

  return (
    <ThemeProvider theme={materialsTheme}>
      <View 
        backgroundColor={tokens.colors.background.primary.value}
        minHeight="100vh"
        padding="2rem"
      >
        <Card 
          variation="elevated" 
          padding="2rem" 
          marginBottom="2rem"
          backgroundColor={tokens.colors.background.tertiary.value}
        >
          <Heading level={1}>{title}</Heading>
          <Text marginTop="1rem">{description}</Text>
        </Card>
        <View>{children}</View>
      </View>
    </ThemeProvider>
  );
};