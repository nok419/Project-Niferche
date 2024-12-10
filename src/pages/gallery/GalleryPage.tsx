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
  Badge,
  Flex,
  useTheme
} from '@aws-amplify/ui-react';
import { ContentCard } from '../../components/common/ContentCard';

interface GalleryItem {
  id: string;
  path: string;
  title: string;
  author: string;
  description?: string;
  category: 'illustration' | 'comment' | 'fanart' | 'concept';
  tags: string[];
  createdAt: string;
  worldType?: 'ALSAREJIA' | 'QUXE' | 'HODEMEI';
  isAvailable: boolean;
}

// より多くのモックデータを追加
const mockGalleryItems: GalleryItem[] = [
  {
    id: 'ill-001',
    path: '/images/sc.jpg', // この画像パスは実際に存在する画像に変更してください
    title: 'サレジアとニファーシェ',
    author: 'サレジア',
    description: 'メインキャラクターのイメージイラスト',
    category: 'illustration',
    tags: ['キャラクター', 'Alsarejia'],
    createdAt: '2024-01-01',
    worldType: 'ALSAREJIA',
    isAvailable: true
  },
  {
    id: 'concept-001',
    path: '/images/sc.jpg',
    title: 'アルサレジア研究所',
    author: 'サレジア',
    description: '研究所の外観コンセプト',
    category: 'concept',
    tags: ['建物', 'Alsarejia'],
    createdAt: '2024-01-02',
    worldType: 'ALSAREJIA',
    isAvailable: true
  },
  {
    id: 'fanart-001',
    path: '/images/sc.jpg',
    title: 'Quxeの風景',
    author: 'ゲスト',
    description: 'Quxeの街並みイメージ',
    category: 'fanart',
    tags: ['風景', 'Quxe'],
    createdAt: '2024-01-03',
    worldType: 'QUXE',
    isAvailable: true
  }
];

export const GalleryPage = () => {
  const [activeCategory, setActiveCategory] = useState<string>('illustration');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [selectedWorld, setSelectedWorld] = useState<string>('all');
  const { tokens } = useTheme();

  const handleCategoryChange = (e: React.FormEvent<HTMLDivElement>) => {
    const target = e.target as HTMLButtonElement;
    if (target.value) {
      setActiveCategory(target.value);
    }
  };
  
  const categories = [
    { value: 'illustration', label: '公式イラスト', description: 'キャラクターやシーンの公式イラスト' },
    { value: 'concept', label: 'コンセプトアート', description: '世界観やデザインのコンセプトアート' },
    { value: 'fanart', label: 'ファンアート', description: 'ユーザーによる創作イラスト' },
    { value: 'comment', label: '注目コメント', description: '重要な考察や印象的なコメント' }
  ];

  const filteredItems = mockGalleryItems.filter(item => {
    const matchesCategory = item.category === activeCategory;
    const matchesTag = selectedTag === 'all' || item.tags.includes(selectedTag);
    const matchesWorld = selectedWorld === 'all' || item.worldType === selectedWorld;
    return matchesCategory && matchesTag && matchesWorld && item.isAvailable;
  });

  const allTags = Array.from(new Set(mockGalleryItems.flatMap(item => item.tags)));

  return (
    // MainLayoutのスタイリングと協調するように修正
    <View width="100%" height="100%">
      <Card variation="elevated" padding="1.5rem">
        <Heading 
          level={1} 
          marginBottom="1.5rem"
          color={tokens.colors.font.primary}
        >
          ギャラリー
        </Heading>
        
        <Flex direction="column" gap="medium">
          {/* フィルターセクション */}
          <Flex gap="medium" wrap="wrap">
            <SelectField
              label="世界でフィルター"
              value={selectedWorld}
              onChange={e => setSelectedWorld(e.target.value)}
            >
              <option value="all">すべての世界</option>
              <option value="ALSAREJIA">Alsarejia</option>
              <option value="QUXE">Quxe</option>
              <option value="HODEMEI">Hodemei</option>
            </SelectField>

            <SelectField
              label="タグでフィルター"
              value={selectedTag}
              onChange={e => setSelectedTag(e.target.value)}
            >
              <option value="all">すべてのタグ</option>
              {allTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </SelectField>
          </Flex>

          {/* カテゴリータブ */}
          <Card backgroundColor={tokens.colors.background.secondary}>
          <Tabs
            spacing="equal"
            value={activeCategory}
            onChange={handleCategoryChange} // 修正したハンドラを使用
          >
              <Tabs.List>
                {categories.map(category => (
                  <Tabs.Item 
                    key={category.value} 
                    value={category.value}
                  >
                    {category.label}
                  </Tabs.Item>
                ))}
              </Tabs.List>
            </Tabs>
          </Card>

          {/* カテゴリー説明 */}
          <Card padding="1rem" backgroundColor={tokens.colors.background.tertiary}>
            <Text>{categories.find(c => c.value === activeCategory)?.description}</Text>
          </Card>

          {/* ギャラリーグリッド */}
          {filteredItems.length > 0 ? (
            <Collection
              type="grid"
              items={filteredItems}
              gap="medium"
              templateColumns={{
                base: "1fr",
                medium: "1fr 1fr",
                large: "1fr 1fr 1fr"
              }}
            >
              {(item: GalleryItem) => (
                <ContentCard
                  key={item.id}
                  title={item.title}
                  description={`by ${item.author}\n${item.description || ''}`}
                  imagePath={item.path}
                  linkTo={`/gallery/view/${item.id}`}
                  footer={
                    <Flex gap="small" wrap="wrap" marginTop="0.5rem">
                      {item.tags.map(tag => (
                        <Badge key={tag} size="small">{tag}</Badge>
                      ))}
                    </Flex>
                  }
                />
              )}
            </Collection>
          ) : (
            <Card padding="2rem" textAlign="center">
              <Text>該当するコンテンツがありません</Text>
            </Card>
          )}
        </Flex>
      </Card>
    </View>
  );
};