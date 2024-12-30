// src/pages/library/MainStory.tsx
import { 
  View, 
  Collection, 
  Card, 
  Text, 
  Button, 
  Heading,
  Flex,
  Badge,
  useTheme 
} from '@aws-amplify/ui-react';
import { StoryViewer } from '../../components/content/StoryViewer';
import { useState } from 'react';
import { ContentSection } from '../../components/common/ContentSection';

interface StoryChapter {
  id: string;
  title: string;
  description: string;
  hasInteractiveContent: boolean;
  chapterNumber: number;
  releaseDate: string;
  status: 'published' | 'coming_soon';
  readingTime: number; // 分単位
}

const mainStoryChapters: StoryChapter[] = [
  {
    id: 'prologue',
    title: '研究記録0: 記憶の欠損',
    description: '全ての始まり。研究所の構内で目覚めた私は自分の記憶を失っていた...',
    hasInteractiveContent: true,
    chapterNumber: 0,
    releaseDate: '2024-01-01',
    status: 'published',
    readingTime: 15
  },
  {
    id: 'chapter1',
    title: '研究記録1: アイデア体の観測',
    description: 'アイデア体の観測開始。創発的な世界の姿が少しずつ見えてくる...',
    hasInteractiveContent: true,
    chapterNumber: 1,
    releaseDate: '2024-02-01',
    status: 'published',
    readingTime: 20
  }
];

export const MainStory = () => {
  const [selectedChapter, setSelectedChapter] = useState<StoryChapter | null>(null);
  const { tokens } = useTheme();

  const StoryMetadata = ({ chapter }: { chapter: StoryChapter }) => (
    <Flex gap="small" wrap="wrap">
      <Badge variation={chapter.status === 'published' ? 'success' : 'warning'}>
        {chapter.status === 'published' ? '公開中' : '近日公開'}
      </Badge>
      <Text fontSize="small" color="font.secondary">
        {`読了時間: 約${chapter.readingTime}分`}
      </Text>
      {chapter.hasInteractiveContent && (
        <Badge variation="info">インタラクティブコンテンツ</Badge>
      )}
    </Flex>
  );

  return (
    <View>
      {selectedChapter ? (
        <View>
          <Button 
            onClick={() => setSelectedChapter(null)} 
            marginBottom="1rem"
            variation="link"
          >
            ← チャプター選択に戻る
          </Button>
          <StoryViewer
            storyPath={`library/mainstory/${selectedChapter.id}`}
            currentChapter={selectedChapter.chapterNumber}
            totalChapters={mainStoryChapters.length}
            onChapterChange={(chapter) => {
              const nextChapter = mainStoryChapters.find(c => c.chapterNumber === chapter);
              if (nextChapter) setSelectedChapter(nextChapter);
            }}
            metadata={{
              title: selectedChapter.title,
              description: selectedChapter.description,
              releaseDate: selectedChapter.releaseDate
            }}
          />
        </View>
      ) : (
        <ContentSection
          title="メインストーリー"
          description="記憶を失った研究者サレジアと、彼が想像/創造した不思議な存在ニファーシェ。
            二人の出会いが織りなす、現実と想像の境界を超えた物語。"
        >
          <Collection
            type="grid"
            items={mainStoryChapters}
            gap="medium"
            templateColumns={{
              base: "1fr",
              medium: "1fr 1fr"
            }}
          >
            {(chapter) => (
              <Card
                key={chapter.id}
                padding="1.5rem"
                variation="elevated"
                onClick={() => chapter.status === 'published' && setSelectedChapter(chapter)}
                style={{
                  cursor: chapter.status === 'published' ? 'pointer' : 'default',
                  opacity: chapter.status === 'published' ? 1 : 0.7
                }}
              >
                <Flex direction="column" gap="medium">
                  <Heading level={3}>{chapter.title}</Heading>
                  <Text color="font.secondary">{chapter.description}</Text>
                  <StoryMetadata chapter={chapter} />
                </Flex>
              </Card>
            )}
          </Collection>
        </ContentSection>
      )}
    </View>
  );
};