// src/components/content/StoryViewer.tsx
import React, { useState, useEffect } from 'react';
import { View, Heading, Text, Button, Flex, Loader, Alert } from '@aws-amplify/ui-react';
import { MockStorageService } from '../../services/mockStorage';

interface StoryViewerProps {
 storyPath: string;
 currentChapter: number;
 totalChapters?: number;
 onChapterChange?: (chapter: number) => void;
 author?: {
   name: string;
   showAuthor: boolean;
 };
 metadata?: {
   title?: string;
   category?: string;
   reference?: string;
 };
}

export const StoryViewer: React.FC<StoryViewerProps> = ({
 storyPath,
 currentChapter,
 totalChapters = 1,
 onChapterChange,
 author,
 metadata
}) => {
 const [content, setContent] = useState<string>('');
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState<string | null>(null);

 useEffect(() => {
   const loadContent = async () => {
     setLoading(true);
     setError(null);
     try {
       const text = await MockStorageService.getText(
         `${storyPath}/chapter${currentChapter}.txt`
       );
       setContent(text);
     } catch (error) {
       console.error('Error loading story content:', error);
       setError('コンテンツの読み込みに失敗しました');
       setContent('');
     } finally {
       setLoading(false);
     }
   };

   loadContent();
 }, [storyPath, currentChapter]);

 return (
   <View className="story-viewer" padding="medium">
     <Flex direction="column" gap="medium">
       {metadata?.title && (
         <Heading level={1}>{metadata.title}</Heading>
       )}
       
       {metadata?.category && metadata?.reference && (
         <Flex justifyContent="space-between" alignItems="center">
           <Text variation="tertiary">{metadata.category}</Text>
           <Text variation="tertiary">Reference: {metadata.reference}</Text>
         </Flex>
       )}

       <Heading level={2}>Chapter {currentChapter}</Heading>
       
       {author?.showAuthor && (
         <Text variation="tertiary">Author: {author.name}</Text>
       )}

       {error && (
         <Alert variation="error">
           {error}
         </Alert>
       )}
       
       <View className="story-content" padding="medium" backgroundColor="white">
         {loading ? (
           <Flex justifyContent="center" padding="medium">
             <Loader size="large" />
           </Flex>
         ) : (
           <Text
             whiteSpace="pre-wrap"
             style={{ lineHeight: '1.6' }}
           >
             {content}
           </Text>
         )}
       </View>

       <Flex justifyContent="space-between" marginTop="large">
         <Button
           onClick={() => onChapterChange?.(currentChapter - 1)}
           disabled={currentChapter <= 1 || loading}
           variation="link"
         >
           前の章へ
         </Button>
         
         <Text variation="tertiary">
           {currentChapter} / {totalChapters}
         </Text>
         
         <Button
           onClick={() => onChapterChange?.(currentChapter + 1)}
           disabled={currentChapter >= totalChapters || loading}
           variation="link"
         >
           次の章へ
         </Button>
       </Flex>
     </Flex>
   </View>
 );
};