import { useState } from 'react';
import { View, Collection, Text, Card, Button, SelectField } from '@aws-amplify/ui-react';
import { StoryViewer } from '../../components/content/StoryViewer';

interface SideStoryContent {
 id: string;
 title: string;
 description: string;
 type: 'official' | 'shared';
 author: string;
 isAvailable: boolean;
 totalChapters: number;
}

const sideStoryContents: SideStoryContent[] = [
 {
   id: 'quxe-researcher',
   title: 'とある研究者の日記',
   description: 'Quxeの世界を研究するために赴任してきた研究者の記録',
   type: 'official',
   author: 'サレジア',
   isAvailable: true,
   totalChapters: 3
 }
];

export const SideStory = () => {
 const [selectedStory, setSelectedStory] = useState<SideStoryContent | null>(null);
 const [filter, setFilter] = useState<'all' | 'official' | 'shared'>('all');
 const [currentChapter, setCurrentChapter] = useState(1);

 const filteredStories = sideStoryContents.filter(story => 
   filter === 'all' || story.type === filter
 );

 return (
   <View padding="2rem">
     {selectedStory ? (
       <View>
         <Button onClick={() => setSelectedStory(null)} marginBottom="1rem">
           ストーリー一覧に戻る
         </Button>
         <StoryViewer
           storyPath={`laboratory/sidestory/${selectedStory.type}/${selectedStory.id}`}
           currentChapter={currentChapter}
           totalChapters={selectedStory.totalChapters}
           onChapterChange={setCurrentChapter}
           author={{
             name: selectedStory.author,
             showAuthor: true
           }}
         />
       </View>
     ) : (
       <>
         <SelectField
           label="表示フィルター"
           value={filter}
           onChange={e => setFilter(e.target.value as typeof filter)}
           marginBottom="1rem"
         >
           <option value="all">すべて表示</option>
           <option value="official">公式ストーリー</option>
           <option value="shared">共有ストーリー</option>
         </SelectField>

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
               onClick={() => story.isAvailable && setSelectedStory(story)}
             >
               <Text fontWeight="bold" fontSize="large">
                 {story.title}
               </Text>
               <Text margin="0.5rem">{story.description}</Text>
               <Text color="font.secondary" fontSize="small">
                 作者: {story.author}
               </Text>
               <Text color="font.secondary" fontSize="small">
                 全{story.totalChapters}話
               </Text>
               {!story.isAvailable && (
                 <Text color="font.error" fontSize="small">
                   ※このストーリーは現在準備中です
                 </Text>
               )}
             </Card>
           )}
         </Collection>
       </>
     )}
   </View>
 );
};