// src/pages/laboratory/IdeaLibrary.tsx
import React, { useState } from 'react';
import { 
 View, 
 Card, 
 Text, 
 Image, 
 Heading, 
 Flex, 
 Badge,
 useTheme,
 Button
} from '@aws-amplify/ui-react';
import { DetailModal } from '../../components/common/DetailModal';

// 研究資料の型定義
interface IdeaDocument {
 id: string;
 title: string; 
 description: string;
 category: 'basic' | 'advanced' | 'research';
 reference: string;
 isAvailable: boolean;
 variant: 'document' | 'image';
 imagePath?: string;
 tags: string[];
 details?: {
   title: string;
   content: string;
 }[];
 metadata?: Record<string, string>;
}

// モックデータ
const ideaDocs: IdeaDocument[] = [
 {
   id: 'idea-basics',
   title: 'アイデア体の基礎',
   description: 'アイデア体の基本的な性質と観測方法について解説します。研究を始める前に必ず確認してください。',
   category: 'basic',
   reference: 'IDE-001',
   isAvailable: true,
   variant: 'document',
   tags: ['入門', '基礎理論'],
   details: [
     {
       title: '概要',
       content: 'アイデア体とは、観測を通じて意味が収束し、共有可能な実在性を獲得した意味的実体です。'
     },
     {
       title: '基本特性',
       content: '精神的観測による意味の収束、複数の観測者間での共有可能性、独自の存在感と自律性などの特徴を持ちます。'
     }
   ],
   metadata: {
     '分類': '基礎理論',
     '公開日': '2024-01-15',
     '更新日': '2024-03-20',
     'バージョン': '1.2'
   }
 },
 // ... 他のモックデータ
];

export const IdeaLibrary: React.FC = () => {
 const [activeCategory, setActiveCategory] = useState<string>('basic');
 const [selectedDocument, setSelectedDocument] = useState<IdeaDocument | null>(null);
 const { tokens } = useTheme();

 return (
   <View 
     padding={{ base: '1rem', medium: '2rem' }}
     backgroundColor={tokens.colors.background.secondary}
   >
     <View 
       backgroundColor={tokens.colors.background.primary}
       padding={{ base: '1.5rem', medium: '2rem' }}
       borderRadius="medium"
     >
       <Heading level={1} marginBottom="1rem">
         アイデアライブラリ
       </Heading>
       
       <Text marginBottom="2rem">
         研究所で蓄積された、アイデア体に関する研究成果と理論をご覧いただけます。
       </Text>

       <Flex 
         gap="medium" 
         marginBottom="2rem"
         backgroundColor={tokens.colors.background.tertiary}
         padding="0.5rem"
         borderRadius="small"
       >
         {[
           { id: 'basic', label: '基礎理論' },
           { id: 'advanced', label: '発展研究' },
           { id: 'research', label: '研究手法' }
         ].map(tab => (
          <Button
          key={tab.id}
          onClick={() => setActiveCategory(tab.id)}
          variation={activeCategory === tab.id ? 'link' : 'menu'}
          backgroundColor={activeCategory === tab.id ? 
            tokens.colors.background.primary : 'transparent'}
          color={activeCategory === tab.id ? 
            tokens.colors.font.primary : tokens.colors.font.secondary}
        >
          {tab.label}
        </Button>
         ))}
       </Flex>

       <Flex gap="medium" wrap="wrap">
         {ideaDocs
           .filter(doc => doc.category === activeCategory)
           .map(doc => (
             <Card
               key={doc.id}
               padding={tokens.space.medium}
               backgroundColor={tokens.colors.background.primary}
               onClick={() => doc.isAvailable && setSelectedDocument(doc)}
               style={{
                 cursor: doc.isAvailable ? 'pointer' : 'default',
                 opacity: doc.isAvailable ? 1 : 0.7,
                 flex: '1 1 400px',
                 minHeight: '300px'
               }}
             >
               {doc.variant === 'image' && doc.imagePath && (
                 <Image
                   src={doc.imagePath}
                   alt={doc.title}
                   width="100%"
                   height="200px"
                   objectFit="cover"
                 />
               )}
               
               <Heading level={3} marginTop="1rem">{doc.title}</Heading>
               <Text marginTop="0.5rem">{doc.description}</Text>
               
               <Flex gap="small" marginTop="1rem" wrap="wrap">
                 {doc.tags.map(tag => (
                   <Badge key={tag} variation="info">{tag}</Badge>
                 ))}
               </Flex>

               <Flex justifyContent="space-between" marginTop="1rem">
                 <Badge variation={doc.isAvailable ? 'success' : 'warning'}>
                   {doc.isAvailable ? '閲覧可能' : '準備中'}
                 </Badge>
                 <Text variation="tertiary">{doc.reference}</Text>
               </Flex>
             </Card>
           ))}
       </Flex>
     </View>

     <DetailModal
       isOpen={!!selectedDocument}
       onClose={() => setSelectedDocument(null)}
       data={selectedDocument ? {
         id: selectedDocument.id,
         title: selectedDocument.title,
         description: selectedDocument.description,
         category: selectedDocument.category,
         imagePath: selectedDocument.imagePath,
         details: selectedDocument.details,
         metadata: selectedDocument.metadata,
         tags: selectedDocument.tags
       } : {
         id: '',
         title: '',
         description: '',
         category: '',
         tags: []
       }}
       entityType="research"
     />
   </View>
 );
};