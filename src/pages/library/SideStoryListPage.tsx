// src/pages/library/SideStoryListPage.tsx
import { useState } from 'react';
import { 
  Collection, 
  Card, 
  Text, 
  Heading,
  Flex,
  Badge,
  SelectField,
  useTheme,
  Button
} from '@aws-amplify/ui-react';
import { useNavigate } from 'react-router-dom';
import { ContentSection } from '../../components/common/ContentSection';

// SideStoryの型
interface SideStoryContent {
  id: string;
  title: string;
  summary: string;
  type: 'official' | 'shared';
  author: string;
  worldCategory: string;
  status: 'published' | 'ongoing' | 'coming_soon';
  totalChapters: number;
  currentChapter?: number;
  releaseDate: string;
  readingTime: number;
  hasInteractiveContent: boolean;
}

// ダミーデータ
const sideStoryContents: SideStoryContent[] = [
  {
    id: 'quxe-researcher',
    title: '研究者の日記',
    summary: 'Quxeの世界を研究するために赴任してきた研究者の記録',
    type: 'official',
    author: 'サレジア',
    worldCategory: 'quxe',
    status: 'published',
    totalChapters: 3,
    currentChapter: 3,
    releaseDate: '2024-01-15',
    readingTime: 25,
    hasInteractiveContent: true
  },
];

export const SideStoryListPage = () => {
  const { tokens } = useTheme();
  const navigate = useNavigate();

  const [filter, setFilter] = useState<'all' | 'official' | 'shared'>('all');
  const [worldFilter, setWorldFilter] = useState<'all' | string>('all');

  const filteredStories = sideStoryContents.filter(story => 
    (filter === 'all' || story.type === filter) &&
    (worldFilter === 'all' || story.worldCategory === worldFilter)
  );

  return (
    <ContentSection title="サイドストーリー" description="様々な世界観・作者による短編や番外編を集めています。">
      <Flex gap="medium" marginBottom="large">
        <SelectField
          label="表示フィルター"
          value={filter}
          onChange={(e) => setFilter(e.target.value as typeof filter)}
        >
          <option value="all">すべて表示</option>
          <option value="official">公式ストーリー</option>
          <option value="shared">共有ストーリー</option>
        </SelectField>

        <SelectField
          label="世界別フィルター"
          value={worldFilter}
          onChange={(e) => setWorldFilter(e.target.value as typeof worldFilter)}
        >
          <option value="all">すべての世界</option>
          <option value="quxe">Quxe</option>
          <option value="hodemei">Hodemei</option>
          <option value="alsarejia">Alsarejia</option>
          <option value="multiple">複数世界</option>
        </SelectField>
      </Flex>

      <Collection
        type="grid"
        items={filteredStories}
        gap={tokens.space.medium}
        templateColumns={{
          base: "1fr",
          medium: "1fr 1fr",
          large: "1fr 1fr 1fr"
        }}
      >
        {(story) => (
          <Card
            key={story.id}
            padding="1.5rem"
            variation="elevated"
            style={{
              cursor: story.status !== 'coming_soon' ? 'pointer' : 'default',
              opacity: story.status !== 'coming_soon' ? 1 : 0.7
            }}
          >
            <Flex direction="column" gap="medium">
              <Heading level={3}>{story.title}</Heading>
              <Text color="font.secondary">{story.summary}</Text>
              <Text fontSize="small">作者: {story.author}</Text>
              
              <Flex gap="small" wrap="wrap">
                <Badge variation={
                  story.status === 'published' ? 'success' :
                  story.status === 'ongoing' ? 'info' : 
                  'warning'
                }>
                  {story.status === 'published' ? '完結' : 
                   story.status === 'ongoing' ? '連載中' : 
                   '近日公開'}
                </Badge>
                <Text fontSize="small" color="font.secondary">
                  {`${story.currentChapter ?? 0}/${story.totalChapters}話`}
                </Text>
              </Flex>

              {story.status !== 'coming_soon' && (
                <Button
                  onClick={() => navigate(`/library/sidestory/detail/${story.id}`)}
                  variation="link"
                  size="small"
                >
                  詳細を見る
                </Button>
              )}
            </Flex>
          </Card>
        )}
      </Collection>
    </ContentSection>
  );
};
