// src/pages/library/LibraryOverviewPage.tsx
import { 
  View, 
  Heading, 
  Text, 
  Card, 
  Collection,
  Badge,
  Flex,
  useTheme 
} from '@aws-amplify/ui-react';
import { ContentCard } from '../../components/common/ContentCard';
import { ContentSection } from '../../components/common/ContentSection';

interface StoryOverview {
  id: string;
  title: string;
  description: string;
  type: 'main' | 'side';
  status: 'published' | 'ongoing' | 'planned';
  thumbnailPath: string;
  chapterCount: number;
  tags: string[];
}

const storyOverviews: StoryOverview[] = [
  {
    id: 'main-story',
    title: 'メインストーリー',
    description: '記憶を失った研究者サレジアと、サレジアが想像/創造した不思議な存在ニファーシェ。二人の出会いが織りなす、現実と想像の境界を超えた物語。',
    type: 'main',
    status: 'ongoing',
    thumbnailPath: '/images/main-story.jpg',
    chapterCount: 3,
    tags: ['現実性研究', 'アイデア体', 'Laboratory Alsarejia']
  },
  // サイドストーリーのエントリーなど
];

export const LibraryOverviewPage = () => {
  const { tokens } = useTheme();

  return (
    <View>
      <ContentSection
        title="Library"
        description="Project Nifercheの物語群をご紹介します。"
      >
        {/* ストーリー概要 */}
        <Card variation="elevated" padding={tokens.space.large}>
          <Heading level={2}>物語について</Heading>
          <Text>
            Laboratory Alsarejiaを舞台に、魔法世界「Quxe」、未来世界「Hodemei」、
            そして不思議な異世界「Alsarejia」を結ぶ物語が展開されます。
          </Text>
        </Card>

        {/* メインストーリーセクション */}
        <ContentSection
          title="メインストーリー"
          description="現実性研究の核心に迫る物語"
        >
          <ContentCard
            title="サレジアとニファーシェ"
            description="記憶を失った研究者と、想像から生まれた存在の物語"
            imagePath="/images/main-story.jpg"
            linkTo="/library/mainstory"
          />
        </ContentSection>

        {/* サイドストーリーセクション */}
        <ContentSection
          title="サイドストーリー"
          description="様々な視点で描かれる物語群"
        >
          <Collection
            type="grid"
            items={storyOverviews.filter(story => story.type === 'side')}
            gap={tokens.space.medium}
            templateColumns={{
              base: "1fr",
              medium: "1fr 1fr",
              large: "1fr 1fr 1fr"
            }}
          >
            {(item) => (
              <ContentCard
                key={item.id}
                title={item.title}
                description={item.description}
                imagePath={item.thumbnailPath}
                linkTo={`/library/sidestory/${item.id}`}
                footer={
                  <Flex gap="small" wrap="wrap">
                    <Badge variation={item.status === 'published' ? 'success' : 'info'}>
                      {item.status === 'published' ? '公開中' : '連載中'}
                    </Badge>
                    <Text fontSize="small">全{item.chapterCount}話</Text>
                  </Flex>
                }
              />
            )}
          </Collection>
        </ContentSection>
      </ContentSection>
    </View>
  );
};