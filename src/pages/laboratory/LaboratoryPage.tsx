// src/pages/laboratory/LaboratoryPage.tsx
import { View, Heading, Grid, Text, Card } from '@aws-amplify/ui-react';
import { ContentCard } from '../../components/common/ContentCard';

const sections = [
  {
    id: 'mainstory',
    title: 'Main Story',
    description: 'メインストーリーのコレクション',
    linkTo: '/laboratory/mainstory',
    imageUrl: '/images/main-story.jpg', // 適切な画像パスに変更してください
  },
  {
    id: 'sidestory',
    title: 'Side Stories',
    description: 'サイドストーリーのコレクション',
    linkTo: '/laboratory/sidestory',
    imageUrl: '/images/side-story.jpg',
  },
  {
    id: 'ideas',
    title: 'アイデア体資料',
    description: 'アイデア体に関する研究資料',
    linkTo: '/laboratory/ideas',
    imageUrl: '/images/ideas.jpg',
  },
  {
    id: 'about',
    title: '研究施設について',
    description: 'Laboratory Alsarejiaの利用案内と規約',
    linkTo: '/laboratory/about',
    imageUrl: '/images/about.jpg',
  },
];

export const LaboratoryPage = () => {
  return (
    <View padding="2rem">
      <Card variation="elevated" padding="2rem" marginBottom="2rem">
        <Heading level={1}>Laboratory Alsarejia</Heading>
        <Text marginTop="1rem">
          Laboratory Alsarejiaへようこそ。
          ここでは物語や研究資料を通じて、新しい世界との出会いを体験できます。
        </Text>
      </Card>

      <Grid
        templateColumns={{
          base: "1fr",
          medium: "1fr 1fr",
          large: "1fr 1fr"
        }}
        gap="2rem"
      >
        {sections.map(section => (
          <ContentCard
            key={section.id}
            title={section.title}
            description={section.description}
            imagePath={section.imageUrl}
            linkTo={section.linkTo}
          />
        ))}
      </Grid>
    </View>
  );
};