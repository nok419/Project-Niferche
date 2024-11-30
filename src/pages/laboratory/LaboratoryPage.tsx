// src/pages/laboratory/LaboratoryPage.tsx
import { View, Heading, Grid ,Text} from '@aws-amplify/ui-react';
import { ContentCard } from '../../components/common/ContentCard';

export const LaboratoryPage = () => {
  return (
    <View padding="2rem">
      <Heading level={1}>Laboratory Alsarejia</Heading>
      <Text>Laboratory Alsarejiaへようこそ。ここでは様々なストーリーや研究資料をご覧いただけます。</Text>
      <Grid
        templateColumns="repeat(auto-fit, minmax(300px, 1fr))"
        gap="1rem"
        marginTop="2rem"
      >
        <ContentCard
          title="Main Story"
          description="メインストーリーのコレクション"
          linkTo="/laboratory/mainstory"
        />
        <ContentCard
          title="Side Stories"
          description="サイドストーリーのコレクション"
          linkTo="/laboratory/sidestory"
        />
        {/* 他のコンテンツカード */}
      </Grid>
    </View>
  );
};

