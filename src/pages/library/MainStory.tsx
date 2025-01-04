// src/pages/library/MainStory.tsx
import { 
  View, 
  Collection, 
  Card, 
  Text, 
  Button, 
  Heading,
  Flex,
  Badge
} from '@aws-amplify/ui-react';
import { StoryViewer } from '../../components/content/StoryViewer';
import { useState } from 'react';
import { ContentSection } from '../../components/common/ContentSection';

interface StoryChapter {
  id: string;
  title: string;
  summary: string;
  chapterNumber: number;
  status: 'published' | 'coming_soon';
  releaseDate: string;
  readingTime: number;
  hasInteractiveContent: boolean;
}

const mainStoryChapters: StoryChapter[] = [
  {
    id: 'prologue',
    title: '研究記録0: 記憶の欠損',
    summary: '全ての始まり。研究所の構内で目覚めた私は自分の記憶を失っていた。\nそこで出会った不思議な存在、ニファーシェ。',
    chapterNumber: 0,
    status: 'published',
    releaseDate: '2024-01-01',
    readingTime: 15,
    hasInteractiveContent: true
  },
  {
    id: 'chapter1',
    title: '研究記録1: アイデア体の観測',
    summary: 'アイデア体の観測を開始する。創発的な世界の姿が少しずつ見えてきた。\n私たちが目指すべきものとは一体...？',
    chapterNumber: 1,
    status: 'published',
    releaseDate: '2024-02-01',
    readingTime: 20,
    hasInteractiveContent: true
  },
  {
    id: 'chapter2',
    title: '研究記録2: 境界の探索',
    summary: '現実と想像の境界線上で、私たちは何を見出すのか。\n研究は新たな段階へと進む...',
    chapterNumber: 2,
    status: 'coming_soon',
    releaseDate: '2024-04-01',
    readingTime: 25,
    hasInteractiveContent: true
  }
];

export const MainStory = () => {
  const [selectedChapter, setSelectedChapter] = useState<StoryChapter | null>(null);

  const ChapterStatus = ({ chapter }: { chapter: StoryChapter }) => (
    <Flex gap="small" wrap="wrap" alignItems="center">
      <Badge variation={chapter.status === 'published' ? 'success' : 'warning'}>
        {chapter.status === 'published' ? '公開中' : '近日公開'}
      </Badge>
      <Text fontSize="small" color="font.secondary">
        {`読了時間: 約${chapter.readingTime}分`}
      </Text>
      {chapter.hasInteractiveContent && (
        <Badge variation="info">対話型コンテンツ</Badge>
      )}
      <Text fontSize="small" color="font.tertiary">
        公開日: {chapter.releaseDate}
      </Text>
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
            ← チャプター一覧に戻る
          </Button>
          <StoryViewer
            storyPath={`library/mainstory/${selectedChapter.id}`}
            currentChapter={selectedChapter.chapterNumber}
            totalChapters={mainStoryChapters.length}
            onChapterChange={(chapter) => {
              const nextChapter = mainStoryChapters.find(c => c.chapterNumber === chapter);
              if (nextChapter && nextChapter.status === 'published') {
                setSelectedChapter(nextChapter);
              }
            }}
            metadata={{
              title: selectedChapter.title,
              reference: `MST-${selectedChapter.chapterNumber.toString().padStart(3, '0')}`
            }}
          />
        </View>
      ) : (
        <ContentSection
          title="メインストーリー"
          description="サレジアとニファーシェが紡ぐ物語。現実と想像の境界で、私たちは何を見出すのか。"
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
                  <Text 
                    color="font.secondary"
                    style={{ whiteSpace: 'pre-line' }}
                  >
                    {chapter.summary}
                  </Text>
                  <ChapterStatus chapter={chapter} />
                </Flex>
              </Card>
            )}
          </Collection>
        </ContentSection>
      )}
    </View>
  );
};