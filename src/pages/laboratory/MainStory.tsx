import { useEffect, useState } from 'react';
import { Heading, Collection, View } from '@aws-amplify/ui-react';
import { ContentDisplay } from '../../components/content/ContentDisplay';
import { StorageService } from '../../services/storage';

export const MainStory = () => {
  const [stories, setStories] = useState<Array<{path: string, title: string}>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStories = async () => {
      try {
        setLoading(true);
        const items = await StorageService.listFiles('laboratory/mainstory/');
        setStories(items.map(item => ({
          path: item.path,
          title: item.path.split('/').pop() || 'Untitled'
        })));
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

  if (loading) {
    return <View>Loading...</View>;
  }

  if (error) {
    return <View>{error}</View>;
  }

  return (
    <View padding="medium">
      <Heading level={1} marginBottom="large">メインストーリー</Heading>
      
      <Collection
        type="list"
        items={stories}
        gap="medium"
      >
        {(story) => (
          <ContentDisplay
            key={story.path}
            path={story.path}
            type="novel"
            title={story.title}
          />
        )}
      </Collection>
    </View>
  );
};