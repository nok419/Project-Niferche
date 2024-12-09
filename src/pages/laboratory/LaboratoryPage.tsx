// src/pages/laboratory/LaboratoryPage.tsx
import { 
  View, 
  Grid, 
  Text, 
  Card,
  Collection,
  Flex
} from '@aws-amplify/ui-react';
import { ContentCard } from '../../components/common/ContentCard';
import { ContentSection } from '../../components/common/ContentSection';

const mainSections = [
  {
    id: 'mainstory',
    title: 'Main Story',
    description: '記憶を失った研究者サレジアと、ニファーシェが織りなす物語',
    linkTo: '/laboratory/mainstory',
    imageUrl: '/images/main-story.jpg',
    isAvailable: true
  },
  {
    id: 'sidestory',
    title: 'Side Stories',
    description: '様々な視点から描かれる物語',
    linkTo: '/laboratory/sidestory',
    imageUrl: '/images/side-story.jpg',
    isAvailable: true
  }
];

const facilitySections = [
  {
    id: 'about',
    title: '研究施設について',
    description: 'Laboratory Alsarejiaの利用案内と規約',
    linkTo: '/laboratory/about',
    imageUrl: '/images/about.jpg',
    isAvailable: true
  },
  {
    id: 'ideas',
    title: 'アイデア体資料',
    description: 'アイデア体に関する研究資料',
    linkTo: '/laboratory/ideas',
    imageUrl: '/images/ideas.jpg',
    isAvailable: false
  }
];

const todaysResearch = {
  id: 'sample-research',
  title: 'サンプル研究報告書',
  content: '研究報告: #2024-001\n本日のアイデア体の観測により、興味深い現象が確認されました...',
  author: 'サレジア'
};

export const LaboratoryPage = () => {
  return (
    <View padding="2rem">
      {/* ヘッダーセクション */}
      <ContentSection 
        variant="laboratory" 
        title="Laboratory Alsarejia" 
        description="世界の狭間に存在する不思議な研究施設。現実と想像の境界を探る研究が日々行われています。"
      >
        <Card 
          variation="elevated" 
          marginTop="1rem"
          padding="1rem"
          style={{ maxHeight: '120px', overflow: 'hidden' }}
        >
          <Flex direction="column" gap="small">
            <Text 
              as="pre" 
              whiteSpace="pre-wrap" 
              fontSize="sm"
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: '3',
                WebkitBoxOrient: 'vertical',
              }}
            >
              {todaysResearch.content}
            </Text>
            <Text 
              textAlign="right" 
              fontStyle="italic"
              fontSize="sm"
              color="font.tertiary"
            >
              - {todaysResearch.author}
            </Text>
          </Flex>
        </Card>
      </ContentSection>

      {/* メインストーリーセクション */}
      <ContentSection
        variant="laboratory"
        title="Stories"
        description="現在公開中の物語"
      >
        <Collection
          type="grid"
          items={mainSections}
          gap="medium"
          templateColumns={{
            base: "1fr",
            medium: "1fr 1fr"
          }}
        >
          {(item) => (
            <ContentCard
              key={item.id}
              title={item.title}
              description={item.description}
              imagePath={item.imageUrl}
              linkTo={item.isAvailable ? item.linkTo : undefined}
              onClick={() => {
                if (!item.isAvailable) {
                  alert('このコンテンツは現在準備中です');
                }
              }}
            />
          )}
        </Collection>
      </ContentSection>

      {/* 施設情報セクション */}
      <ContentSection
        variant="laboratory"
        title="Facility"
        description="研究施設の利用案内"
      >
        <Grid
          templateColumns={{
            base: "1fr",
            medium: "1fr 1fr"
          }}
          gap="medium"
        >
          {facilitySections.map(section => (
            <ContentCard
              key={section.id}
              title={section.title}
              description={section.description}
              imagePath={section.imageUrl}
              linkTo={section.isAvailable ? section.linkTo : undefined}
              onClick={() => {
                if (!section.isAvailable) {
                  alert('このコンテンツは現在準備中です');
                }
              }}
            />
          ))}
        </Grid>
      </ContentSection>

      {/* フッター的な要素 */}
      <Flex 
        direction="column" 
        alignItems="center" 
        marginTop="4rem"
        padding="2rem"
        backgroundColor="background.secondary"
        borderRadius="medium"
      >
        <Text fontSize="sm" color="font.tertiary">
          「全ては観測者の意識の中に存在する」
        </Text>
      </Flex>
    </View>
  );
};