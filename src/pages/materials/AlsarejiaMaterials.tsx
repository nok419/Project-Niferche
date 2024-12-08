// src/pages/materials/AlsarejiaMaterials.tsx
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
  Loader,
  ToggleButton,
  ToggleButtonGroup
} from '@aws-amplify/ui-react';
import { ContentCard } from '../../components/common/ContentCard';
import { useEffect, useState, useCallback } from 'react';
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
  type: AlsarejiaContentType;
}

const sections: ContentItem[] = [
  {
    id: 'facility-overview',
    title: '研究施設概要',
    description: 'アルサレジア研究施設の基本構造と機能',
    contentPath: 'facility/overview',
    type: 'facility',
    isAvailable: false
  }
  // 他のセクションもここに追加
];

export const AlsarejiaMaterials = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<AlsarejiaContentType>('facility');
  const [contentType, setContentType] = useState<'official' | 'shared'>('official');
  const [contents, setContents] = useState<ContentItem[]>(sections);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadContents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const basePath = `materials/alsarejia/${contentType}/`;
      console.log('Loading contents from path:', basePath);
      
      const items = await StorageService.listFiles(basePath);
      console.log('Loaded items:', items);

      const availablePaths = items.map(item => item.path);
      
      const updatedContents = sections.map(section => ({
        ...section,
        contentPath: `${basePath}${section.contentPath}`,
        isAvailable: availablePaths.some(path => 
          path.includes(section.contentPath.replace(`${basePath}`, ''))
        )
      }));

      setContents(updatedContents);
    } catch (error) {
      console.error('Detailed error:', error);
      setError(error instanceof Error ? error.message : 'コンテンツの読み込み中にエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  }, [contentType]);

  useEffect(() => {
    loadContents();
  }, [loadContents]);

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

      <Flex direction="column" gap="medium">
        <ToggleButtonGroup
          value={contentType}
          isExclusive
          onChange={(value) => setContentType(value as 'official' | 'shared')}
        >
          <ToggleButton value="official">公式設定</ToggleButton>
          <ToggleButton value="shared">共有設定</ToggleButton>
        </ToggleButtonGroup>

        {error && (
          <Alert
            variation="error"
            isDismissible={true}
            hasIcon={true}
            heading="エラー"
          >
            {error}
          </Alert>
        )}

        <Tabs
          spacing="equal"
          value={activeTab}
          onChange={(e) => {
            const target = e.target as HTMLButtonElement;
            if (target.value) {
              setActiveTab(target.value as AlsarejiaContentType);
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

          <Tabs.Panel value={activeTab}>
            {filteredContents.length > 0 ? (
              <Collection
                type="grid"
                items={filteredContents}
                gap="medium"
                templateColumns={{
                  base: "1fr",
                  medium: "1fr 1fr",
                  large: "1fr 1fr 1fr"
                }}
              >
                {(content) => (
                  <ContentCard
                    key={content.id}
                    title={content.title}
                    description={content.description}
                    imagePath={content.imagePath || `/images/materials/${content.id}.jpg`}
                    linkTo={content.isAvailable ? 
                      `/materials/${contentType}/alsarejia/${content.id}` : 
                      '#'
                    }
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
                  <Button 
                    variation="primary"
                    onClick={() => navigate('/materials')}
                  >
                    戻る
                  </Button>
                </Flex>
              </Card>
            )}
          </Tabs.Panel>
        </Tabs>
      </Flex>
    </View>
  );
};