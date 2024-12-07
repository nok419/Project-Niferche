// src/pages/materials/MaterialsLayout.tsx
import { 
  View, 
  Heading, 
  Grid, 
  Text, 
  Card, 
  Tabs,
  Collection,
  Flex,
  Badge
} from '@aws-amplify/ui-react';
import { ContentCard } from '../../components/common/ContentCard';
import { useEffect, useState } from 'react';
import { StorageService } from '../../services/storage';

// メインセクションの定義
const mainSections = [
  {
    id: 'common',
    title: '共通設定資料',
    description: '全ての世界に共通する基本法則や概念について',
    linkTo: '/materials/common',
    imagePath: '/images/common-materials.jpg',
    badge: '重要'
  },
  {
    id: 'quxe',
    title: 'Quxe World',
    description: '魔法と精霊の世界に関する設定資料',
    linkTo: '/materials/quxe',
    imagePath: '/images/quxe-materials.jpg'
  },
  {
    id: 'hodemei',
    title: 'Hodemei World',
    description: '科学と技術の未来世界に関する設定資料',
    linkTo: '/materials/hodemei',
    imagePath: '/images/hodemei-materials.jpg'
  },
  {
    id: 'alsarejia',
    title: 'Alsarejia Research Facility',
    description: '研究施設に関する設定資料',
    linkTo: '/materials/alsarejia',
    imagePath: '/images/alsarejia-materials.jpg'
  }
];

// 注目コンテンツのインターフェース
interface FeaturedContent {
  id: string;
  title: string;
  description: string;
  type: 'NEW' | 'HOT' | 'IMPORTANT';
  path: string;
}

export const MaterialsAbout = () => {
  const [featuredContents, setFeaturedContents] = useState<FeaturedContent[]>([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const loadFeaturedContents = async () => {
      try {
        const items = await StorageService.listFiles('materials/featured/');
        // データをFeaturedContent[]の形式に変換
        const formatted = items.map(item => ({
          id: item.path,
          title: item.path.split('/').pop() || 'Untitled',
          description: 'Description placeholder', // 実際のデータから取得する
          type: 'NEW' as const,
          path: item.path
        }));
        setFeaturedContents(formatted);
      } catch (error) {
        console.error('Error loading featured contents:', error);
      }
    };

    loadFeaturedContents();
  }, []);

  return (
    <View padding="2rem">
      {/* ヘッダーセクション */}
      <Card variation="elevated" padding="2rem" marginBottom="2rem">
        <Heading level={1}>設定資料集</Heading>
        <Text marginTop="1rem">
          Project Nifercheの世界観や設定に関する資料を閲覧できます。
          各世界の基本設定や詳細な資料を体系的に整理しています。
        </Text>
      </Card>

      {/* タブナビゲーション */}
      <Tabs
        spacing="equal"
        marginBottom="2rem"
        value={activeTab}
        onChange={(e) => {
          const target = e.target as HTMLButtonElement;
          setActiveTab(target.value);
        }}
      >
        <Tabs.List>
          <Tabs.Item value="overview">概要</Tabs.Item>
          <Tabs.Item value="featured">注目コンテンツ</Tabs.Item>
          <Tabs.Item value="guide">利用案内</Tabs.Item>
          <Tabs.Item value="terms">利用規約</Tabs.Item>
        </Tabs.List>

        {/* 概要タブ */}
        <Tabs.Panel value="overview">
          <Grid
            templateColumns={{
              base: "1fr",
              medium: "1fr 1fr",
              large: "1fr 1fr"
            }}
            gap="2rem"
          >
            {mainSections.map(section => (
              <ContentCard
                key={section.id}
                {...section}
              />
            ))}
          </Grid>
        </Tabs.Panel>

        {/* 注目コンテンツタブ */}
        <Tabs.Panel value="featured">
          <Collection
            type="grid"
            items={featuredContents}
            gap="medium"
            templateColumns={{
              base: "1fr",
              medium: "1fr 1fr",
              large: "1fr 1fr 1fr"
            }}
          >
            {(item: FeaturedContent) => (
              <Card key={item.id} variation="elevated">
                <Flex direction="column" gap="xs">
                  <Badge variation={
                    item.type === 'NEW' ? 'info' :
                    item.type === 'HOT' ? 'warning' : 'success'
                  }>
                    {item.type}
                  </Badge>
                  <Heading level={3}>{item.title}</Heading>
                  <Text>{item.description}</Text>
                </Flex>
              </Card>
            )}
          </Collection>
        </Tabs.Panel>

        {/* 利用案内タブ */}
        <Tabs.Panel value="guide">
          <Card>
            <Heading level={2}>設定資料の使い方</Heading>
            <Text>※ 利用案内のコンテンツをここに実装</Text>
          </Card>
        </Tabs.Panel>

        {/* 利用規約タブ */}
        <Tabs.Panel value="terms">
          <Card>
            <Heading level={2}>設定資料の利用規約</Heading>
            <Text>※ 利用規約のコンテンツをここに実装</Text>
          </Card>
        </Tabs.Panel>
      </Tabs>
    </View>
  );
};