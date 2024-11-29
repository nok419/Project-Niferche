import { useEffect, useState } from 'react';
import { 
  Heading, 
  Collection, 
  View, 
  SelectField,
  Flex,
  Text
} from '@aws-amplify/ui-react';
import { ContentDisplay } from '../../components/content/ContentDisplay';
import { StorageService } from '../../services/storage';

interface StoryItem {
  path: string;
  title: string;
  type: 'official' | 'shared';
}

export const SideStory = () => {
  const [stories, setStories] = useState<StoryItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'official' | 'shared'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStories = async () => {
      try {
        setLoading(true);
        // 公式とsharedの両方のストーリーを取得
        const officialItems = await StorageService.listFiles('laboratory/sidestory/official/');
        const sharedItems = await StorageService.listFiles('laboratory/sidestory/shared/');

        const formattedStories: StoryItem[] = [
          ...officialItems.map(item => ({
            path: item.path,
            title: item.path.split('/').pop()?.replace(/\.[^/.]+$/, '') || 'Untitled',
            type: 'official' as const
          })),
          ...sharedItems.map(item => ({
            path: item.path,
            title: item.path.split('/').pop()?.replace(/\.[^/.]+$/, '') || 'Untitled',
            type: 'shared' as const
          }))
        ];

        setStories(formattedStories);
        setError(null);
      } catch (err) {
        setError('ストーリーの読み込みに失敗しました');
        console.error('Error loading stories:', err);
      } finally {
        setLoading(false);
      }
    };

    loadStories();
  }, []);

  const filteredStories = stories.filter(story => 
    filter === 'all' ? true : story.type === filter
  );

  if (loading) {
    return <View padding="medium">Loading...</View>;
  }

  if (error) {
    return <View padding="medium">{error}</View>;
  }

  return (
    <View padding="medium">
      <Heading level={1} marginBottom="large">サイドストーリー</Heading>
      
      <Flex direction="column" gap="large">
        <Flex justifyContent="space-between" alignItems="center">
          <SelectField
            label="表示フィルター"
            value={filter}
            onChange={e => setFilter(e.target.value as typeof filter)}
          >
            <option value="all">すべて表示</option>
            <option value="official">公式ストーリー</option>
            <option value="shared">共有ストーリー</option>
          </SelectField>
        </Flex>

        {filteredStories.length === 0 ? (
          <Text>表示するストーリーがありません</Text>
        ) : (
          <Collection
            type="list"
            items={filteredStories}
            gap="medium"
          >
            {(story) => (
              <ContentDisplay
                key={story.path}
                path={story.path}
                type="novel"
                title={`${story.title} (${story.type === 'official' ? '公式' : '共有'})`}
              />
            )}
          </Collection>
        )}
      </Flex>
    </View>
  );
};
