// src/pages/library/SideStory.tsx
import { 
  View, 
  Collection, 
  Card, 
  Text, 
  Button, 
  Heading,
  Flex,
  Badge,
  SelectField
} from '@aws-amplify/ui-react';
import { StoryViewer } from '../../components/content/StoryViewer';
import { useState } from 'react';
import { ContentSection } from '../../components/common/ContentSection';

interface SideStoryContent {
  id: string;
  title: string;
  summary: string;
  type: 'official' | 'shared';
  author: string;
  worldCategory: 'quxe' | 'hodemei' | 'alsarejia' | 'multiple';
  status: 'published' | 'ongoing' | 'coming_soon';
  totalChapters: number;
  currentChapter?: number;
  releaseDate: string;
  readingTime: number;
  hasInteractiveContent: boolean;
}

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
  // 他のサイドストーリーをここに追加
];

export const SideStory = () => {
  const [selectedStory, setSelectedStory] = useState<SideStoryContent | null>(null);
  const [filter, setFilter] = useState<'all' | 'official' | 'shared'>('all');
  const [worldFilter, setWorldFilter] = useState<'all' | SideStoryContent['worldCategory']>('all');
  const [currentChapter, setCurrentChapter] = useState(1);

  const filteredStories = sideStoryContents.filter(story => 
    (filter === 'all' || story.type === filter) &&
    (worldFilter === 'all' || story.worldCategory === worldFilter)
  );

  const StoryMetadata = ({ story }: { story: SideStoryContent }) => (
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
      <Text fontSize="small" color="font.secondary">
        {`読了時間: 約${story.readingTime}分`}
      </Text>
    </Flex>
  );

  return (
    <View>
      {selectedStory ? (
        <View>
          <Button 
            onClick={() => setSelectedStory(null)} 
            marginBottom="1rem"
            variation="link"
          >
            ← ストーリー一覧に戻る
          </Button>
          <StoryViewer
            storyPath={`library/sidestory/${selectedStory.type}/${selectedStory.id}`}
            currentChapter={currentChapter}
            totalChapters={selectedStory.totalChapters}
            onChapterChange={setCurrentChapter}
            metadata={{
              title: selectedStory.title,
              category: selectedStory.worldCategory,
              reference: selectedStory.type
            }}
            author={{
              name: selectedStory.author,
              showAuthor: true
            }}
          />
        </View>
      ) : (
        <ContentSection title="サイドストーリー">
          <Flex gap="medium" marginBottom="large">
            <SelectField
              label="表示フィルター"
              value={filter}
              onChange={e => setFilter(e.target.value as typeof filter)}
            >
              <option value="all">すべて表示</option>
              <option value="official">公式ストーリー</option>
              <option value="shared">共有ストーリー</option>
            </SelectField>

            <SelectField
              label="世界別フィルター"
              value={worldFilter}
              onChange={e => setWorldFilter(e.target.value as typeof worldFilter)}
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
            gap="medium"
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
                onClick={() => story.status !== 'coming_soon' && setSelectedStory(story)}
                style={{
                  cursor: story.status !== 'coming_soon' ? 'pointer' : 'default',
                  opacity: story.status !== 'coming_soon' ? 1 : 0.7
                }}
              >
                <Flex direction="column" gap="medium">
                  <Heading level={3}>{story.title}</Heading>
                  <Text color="font.secondary">{story.summary}</Text>
                  <Text fontSize="small">
                    作者: {story.author}
                  </Text>
                  <StoryMetadata story={story} />
                </Flex>
              </Card>
            )}
          </Collection>
        </ContentSection>
      )}
    </View>
  );
};