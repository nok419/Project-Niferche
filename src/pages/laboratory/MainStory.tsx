import { View, Collection, Card, Text, Button } from '@aws-amplify/ui-react';
import { StoryViewer } from '../../components/content/StoryViewer';
import { useState } from 'react';

interface StoryChapter {
 id: string;
 title: string;
 description: string;
 hasInteractiveContent: boolean;
 chapterNumber: number;
}

const mainStoryChapters: StoryChapter[] = [
 {
   id: 'prologue',
   title: '研究記録0',
   description: '全ての始まり。研究所の構内で目覚めた私は自分の記憶を失っていた...',
   hasInteractiveContent: true,
   chapterNumber: 0
 },
 {
   id: 'chapter1',
   title: '研究記録1',
   description: 'アイデア体の観測開始。創発的な世界の姿が少しずつ見えてくる...',
   hasInteractiveContent: true,
   chapterNumber: 1
 }
];

export const MainStory = () => {
 const [selectedChapter, setSelectedChapter] = useState<StoryChapter | null>(null);

 return (
   <View padding="2rem">
     {selectedChapter ? (
       <View>
         <Button onClick={() => setSelectedChapter(null)} marginBottom="1rem">
           チャプター選択に戻る
         </Button>
         <StoryViewer
           storyPath={`laboratory/mainstory/${selectedChapter.id}`}
           currentChapter={selectedChapter.chapterNumber}
           totalChapters={mainStoryChapters.length}
           onChapterChange={(chapter) => {
             const nextChapter = mainStoryChapters.find(c => c.chapterNumber === chapter);
             if (nextChapter) setSelectedChapter(nextChapter);
           }}
         />
       </View>
     ) : (
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
             onClick={() => setSelectedChapter(chapter)}
           >
             <Text fontWeight="bold" fontSize="large">
               {chapter.title}
             </Text>
             <Text color="font.tertiary">
               {chapter.description}
             </Text>
             {chapter.hasInteractiveContent && (
               <Text fontSize="small" color="blue.600">
                 ※このチャプターには対話的なコンテンツが含まれています
               </Text>
             )}
           </Card>
         )}
       </Collection>
     )}
   </View>
 );
};