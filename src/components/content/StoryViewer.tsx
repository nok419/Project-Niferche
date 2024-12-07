// src/components/content/StoryViewer.tsx
import { View } from '@aws-amplify/ui-react';
import { ContentDisplay } from './ContentDisplay'; 

interface StoryViewerProps {
  storyPath: string;
  currentChapter: number;
  totalChapters?: number;
  onChapterChange: (chapter: number) => void;
}

export const StoryViewer: React.FC<StoryViewerProps> = ({
  storyPath,
  currentChapter,
  totalChapters,
  onChapterChange
}) => {
  const chapterPath = `${storyPath}/chapter${currentChapter}.txt`;

  return (
    <View>
      <ContentDisplay
        path={chapterPath}
        type="novel"
        title={`第${currentChapter}話`}
        pagination={{
          currentPage: currentChapter,
          totalPages: totalChapters,
          onPageChange: onChapterChange
        }}
      />
    </View>
  );
};