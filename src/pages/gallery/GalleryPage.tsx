// src/pages/gallery/GalleryPage.tsx
import { useState } from 'react';
import { 
  View, 
  Heading, 
  Tabs, 
  Collection, 
  SelectField,
  Card,
  Text,
  Flex
} from '@aws-amplify/ui-react';
import { ContentCard } from '../../components/common/ContentCard';

interface GalleryItem {
  path: string;
  title: string;
  author: string;
  description?: string;
  category: 'illustration' | 'comment' | 'fanart' | 'concept';
  tags: string[];
  createdAt: string;
}

export const GalleryPage = () => {
  const [activeTab, setActiveTab] = useState<string>('illustration');
  const [selectedTag, setSelectedTag] = useState<string>('all');

  const categories = [
    { value: 'illustration', label: '公式イラスト', description: 'キャラクターやシーンの公式イラスト' },
    { value: 'concept', label: 'コンセプトアート', description: '世界観やデザインのコンセプトアート' },
    { value: 'fanart', label: 'ファンアート', description: 'ユーザーによる創作イラスト' },
    { value: 'comment', label: '注目コメント', description: '重要な考察や印象的なコメント' }
  ];

  const tags = [
    'キャラクター', '風景', '設定資料', '考察',
    'アルサレジア', 'キュクセ', 'ホーデメイ'
  ];

  const handleTabChange = (event: React.FormEvent<HTMLDivElement>) => {
    // event.target の value を取得してセット
    const target = event.target as HTMLButtonElement;
    setActiveTab(target.value);
  };

  return (
    <View padding="2rem">
      <Heading level={1}>ギャラリー</Heading>
      
      <Tabs
        spacing="equal"
        marginTop="2rem"
        marginBottom="2rem"
        value={activeTab}
        onChange={handleTabChange}
      >
        <Tabs.List>
        {categories.map(category => (
            <Tabs.Item 
              key={category.value} 
              value={category.value}
              onClick={() => setActiveTab(category.value)} // こちらでも状態を更新
            >
              {category.label}
            </Tabs.Item>
          ))}
        </Tabs.List>

        {categories.map(category => (
          <Tabs.Panel key={category.value} value={category.value}>
            <Card padding="1rem" marginBottom="2rem">
              <Text>{category.description}</Text>
            </Card>
            
            <Flex direction="column" gap="medium">
              <SelectField
                label="タグでフィルター"
                value={selectedTag}
                onChange={e => setSelectedTag(e.target.value)}
              >
                <option value="all">すべてのタグ</option>
                {tags.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </SelectField>

              <Collection
                type="grid"
                items={[]} // StorageServiceから取得したアイテム
                gap="medium"
                templateColumns={{
                  base: "1fr",
                  medium: "1fr 1fr",
                  large: "1fr 1fr 1fr"
                }}
              >
                {(item: GalleryItem) => (
                  <ContentCard
                    key={item.path}
                    title={item.title}
                    description={`by ${item.author}\n${item.description || ''}`}
                    imagePath={item.path}
                    linkTo={`/gallery/view/${item.path}`}
                  />
                )}
              </Collection>
            </Flex>
          </Tabs.Panel>
        ))}
      </Tabs>
    </View>
  );
};