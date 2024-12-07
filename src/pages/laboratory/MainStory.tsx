import { useEffect, useState } from 'react';
import { Text,Heading, View } from '@aws-amplify/ui-react';
import { StoryViewer } from '../../components/content/StoryViewer';
import { StorageService } from '../../services/storage';

// src/pages/laboratory/MainStory.tsx
export const MainStory = () => {
  const [currentChapter, setCurrentChapter] = useState(1);
  const [totalChapters, setTotalChapters] = useState<number | undefined>();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadChapterCount = async () => {
      try {
        setLoading(true);
        const items = await StorageService.listFiles('laboratory/mainstory/');
        setTotalChapters(items.length);
      } catch (error) {
        console.error('Error loading chapter count:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadChapterCount();
  }, []);

  if (loading) {
    return (
      <View padding="medium">
        <Text>Loading story information...</Text>
      </View>
    );
  }

  return (
    <View padding="medium">
      <Heading level={1} marginBottom="large">メインストーリー</Heading>
      <StoryViewer
        storyPath="laboratory/mainstory"
        currentChapter={currentChapter}
        totalChapters={totalChapters}
        onChapterChange={setCurrentChapter}
      />
    </View>
  );
};