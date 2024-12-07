// src/pages/materials/CommonSetting.tsx
import { 
  View, 
  Heading, 
  Tabs, 
  Collection,
  Card,
  Text,
  Flex,
  Alert,
  Button,
  Loader
} from '@aws-amplify/ui-react';
import { ContentCard } from '../../components/common/ContentCard';
import { useEffect, useState } from 'react';
import { StorageService } from '../../services/storage';
import { useNavigate } from 'react-router-dom';

type AlsarejiaContentType = 'facility' | 'idea' | 'technology' | 'character' | 'history';
interface ContentItem {
  id: string;
  title: string;
  description: string;
  imagePath?: string;
  contentPath: string;
  isAvailable: boolean;
  type: AlsarejiaContentType
}

// Alsarejia用
const sections: ContentItem[] = [
  {
    id: 'facility-overview',
    title: '研究施設概要',
    description: 'アルサレジア研究施設の基本構造と機能',
    contentPath: 'materials/alsarejia/facility/overview',
    type: 'facility',
    isAvailable: false
  },
  // ...他のセクション
];

export const AlsarejiaMaterials = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('theory');
  const [contents, setContents] = useState<ContentItem[]>(sections);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadContents = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const items = await StorageService.listFiles('materials/alsarejia/');
        
        // 存在するコンテンツのパスを取得
        const availablePaths = items.map(item => item.path);

        // セクション定義を更新（存在するコンテンツをマーク）
        const updatedContents = sections.map(section => ({
          ...section,
          isAvailable: availablePaths.includes(section.contentPath)
        }));

        setContents(updatedContents);
      } catch (error) {
        console.error('Error loading contents:', error);
        setError('コンテンツの読み込み中にエラーが発生しました');
      } finally {
        setIsLoading(false);
      }
    };

    loadContents();
  }, []);

  const filteredContents = contents.filter(content => content.type === activeTab);

  if (isLoading) {
    return (
      <View padding="2rem">
        <Flex direction="column" alignItems="center">
          <Loader size="large" />
          <Text>コンテンツを読み込んでいます...</Text>
        </Flex>
      </View>
    );
  }

  return (
    <View padding="2rem">
      <Card variation="elevated" padding="2rem" marginBottom="2rem">
      <Heading level={1}>Alsarejia 設定資料</Heading>
        <Text marginTop="1rem">
        全ての物語が交差する不思議な研究施設、Alsarejiaの資料を整理しています。
        </Text>
      </Card>

      {error && (
        <Alert
          variation="error"
          isDismissible={true}
          hasIcon={true}
          heading="エラー"
          marginBottom="2rem"
        >
          {error}
        </Alert>
      )}

      <Tabs
        spacing="equal"
        marginBottom="2rem"
        value={activeTab}
        onChange={(e) => {
          const target = e.target as HTMLButtonElement;
          if (target.value) {
            setActiveTab(target.value);
          }
        }}
      >
        <Tabs.List>
          <Tabs.Item value="facility">研究施設</Tabs.Item>
          <Tabs.Item value="idea">アイデア体</Tabs.Item>
          <Tabs.Item value="technology">特殊技術</Tabs.Item>
          <Tabs.Item value="character">キャラクター</Tabs.Item>
          <Tabs.Item value="history">歴史</Tabs.Item>
        </Tabs.List>

        {['theory', 'language'].map(tabValue => (
          <Tabs.Panel key={tabValue} value={tabValue}>
            {filteredContents.length > 0 ? (
              <Collection
                type="grid"
                items={filteredContents}
                gap="medium"
                templateColumns={{
                  base: "1fr",
                  medium: "1fr 1fr",
                  large: "1fr 1fr"
                }}
              >
                {(content) => (
                  <ContentCard
                    key={content.id}
                    title={content.title}
                    description={content.description}
                    imagePath={content.imagePath || `/images/materials/${content.id}.jpg`}
                    linkTo={content.isAvailable ? `/materials/common/${content.id}` : '#'}
                    onClick={() => {
                      if (!content.isAvailable) {
                        alert('このコンテンツは現在準備中です');
                      }
                    }}
                  />
                )}
              </Collection>
            ) : (
              <Card padding="2rem">
                <Flex direction="column" alignItems="center" gap="1rem">
                  <Text>このカテゴリのコンテンツは現在準備中です</Text>
                  <Button onClick={() => navigate('/materials')}>
                    戻る
                  </Button>
                </Flex>
              </Card>
            )}
          </Tabs.Panel>
        ))}

        <Tabs.Panel value="reference">
          <Card padding="2rem">
            <Heading level={2}>参考文献・資料</Heading>
            <Text>※ 参考資料リストは現在準備中です</Text>
          </Card>
        </Tabs.Panel>
      </Tabs>
    </View>
  );
};