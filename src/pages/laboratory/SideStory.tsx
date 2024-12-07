// src/pages/laboratory/SideStory.tsx
import { useEffect, useState } from 'react';
import { 
  View, 
  Heading, 
  SelectField,
  Collection,
  Text,
  Flex,
  Button
} from '@aws-amplify/ui-react';
import { StoryViewer } from '../../components/content/StoryViewer';
import { StorageService } from '../../services/storage';
import { ContentCard } from '../../components/common/ContentCard';

interface StoryMetadata {
  path: string;  // keyをpathに変更
  title: string;
  type: 'official' | 'shared';
  chapterCount: number;
}


export const SideStory = () => {
  const [stories, setStories] = useState<StoryMetadata[]>([]);
  const [selectedStory, setSelectedStory] = useState<StoryMetadata | null>(null);
  const [currentChapter, setCurrentChapter] = useState(1);
  const [filter, setFilter] = useState<'all' | 'official' | 'shared'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStories = async () => {
      try {
        setLoading(true);
        const officialItems = await StorageService.listFiles('laboratory/sidestory/official');
        const sharedItems = await StorageService.listFiles('laboratory/sidestory/shared');

        const formattedStories = [
          ...officialItems.map(item => ({
            path: item.path,  // keyをpathに変更
            title: item.path.split('/').pop()?.replace(/\.txt$/, '') || 'Untitled',
            type: 'official' as const,
            chapterCount: 1,
          })),
          ...sharedItems.map(item => ({
            path: item.path,  // keyをpathに変更
            title: item.path.split('/').pop()?.replace(/\.txt$/, '') || 'Untitled',
            type: 'shared' as const,
            chapterCount: 1,
          }))
        ];

        setStories(formattedStories);
      } catch (error) {
        console.error('Error loading stories:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStories();
  }, []);

  const filteredStories = stories.filter(story => 
    filter === 'all' ? true : story.type === filter
  );

  return (
    <View padding="medium">
      <Heading level={1}>サイドストーリー</Heading>
      
      <Flex direction="column" gap="medium">
        <SelectField
          label="表示フィルター"
          value={filter}
          onChange={e => setFilter(e.target.value as typeof filter)}
        >
          <option value="all">すべて表示</option>
          <option value="official">公式ストーリー</option>
          <option value="shared">共有ストーリー</option>
        </SelectField>

        {loading ? (
          <Text>Loading...</Text>
        ) : selectedStory ? (
          <>
            <Button onClick={() => setSelectedStory(null)}>
              ストーリー一覧に戻る
            </Button>
            <StoryViewer
              storyPath={`laboratory/sidestory/${selectedStory.type}/${selectedStory.path}`}
              currentChapter={currentChapter}
              totalChapters={selectedStory.chapterCount}
              onChapterChange={setCurrentChapter}
            />
          </>
        ) : (
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
              <ContentCard
                key={story.path}
                title={story.title}
                description={`${story.type === 'official' ? '公式' : '共有'}ストーリー`}
                linkTo={`#${story.path}`} // 仮のリンク先を設定
                onClick={() => {
                  setSelectedStory(story);
                  setCurrentChapter(1);
                }}
              />
            )}
          </Collection>
        )}
      </Flex>
    </View>
  );
};