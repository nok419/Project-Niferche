import { useEffect, useState } from 'react';
import { 
  View, 
  Heading, 
  Flex, 
  Collection,
  Divider,
  Text
} from '@aws-amplify/ui-react';
import { StorageService } from '../../services/storage';
import { ContentCard } from '../../components/common/ContentCard';

interface MaterialItem {
  path: string;
  title: string;
  category: string;
}

export const CommonMaterials = () => {
  const [materials, setMaterials] = useState<MaterialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMaterials = async () => {
      try {
        setLoading(true);
        // 各カテゴリのコンテンツを読み込み
        const mainSysItems = await StorageService.listFiles('materials/official/common/mainsys/');
        const lefiItems = await StorageService.listFiles('materials/official/common/lefi/');
        const glossaryItems = await StorageService.listFiles('materials/official/common/glossary/');

        const formattedMaterials: MaterialItem[] = [
          ...mainSysItems.map(item => ({
            path: item.path,
            title: item.path.split('/').pop()?.replace(/\.[^/.]+$/, '') || 'Untitled',
            category: '主要システム'
          })),
          ...lefiItems.map(item => ({
            path: item.path,
            title: item.path.split('/').pop()?.replace(/\.[^/.]+$/, '') || 'Untitled',
            category: 'Lefi言語'
          })),
          ...glossaryItems.map(item => ({
            path: item.path,
            title: item.path.split('/').pop()?.replace(/\.[^/.]+$/, '') || 'Untitled',
            category: '用語集'
          }))
        ];

        setMaterials(formattedMaterials);
        setError(null);
      } catch (err) {
        setError('設定資料の読み込みに失敗しました');
        console.error('Error loading materials:', err);
      } finally {
        setLoading(false);
      }
    };

    loadMaterials();
  }, []);

  if (loading) {
    return <View padding="medium">Loading...</View>;
  }

  if (error) {
    return <View padding="medium">{error}</View>;
  }

  const categories = ['主要システム', 'Lefi言語', '用語集'];

  return (
    <View padding="medium">
      <Flex direction="column" gap="large">
        {categories.map(category => {
          const categoryMaterials = materials.filter(m => m.category === category);
          
          return (
            <View key={category}>
              <Heading level={2}>{category}</Heading>
              <Divider marginBottom="medium" />
              
              {categoryMaterials.length === 0 ? (
                <Text>コンテンツがありません</Text>
              ) : (
                <Collection
                  type="grid"
                  items={categoryMaterials}
                  gap="medium"
                  templateColumns={{
                    base: "1fr",
                    medium: "1fr 1fr",
                    large: "1fr 1fr 1fr"
                  }}
                >
                  {(material) => (
                    <ContentCard
                      key={material.path}
                      title={material.title}
                      description={`${material.category}の設定資料`}
                      onClick={() => {
                        // ここで設定資料の詳細表示処理を実装
                        console.log(`Opening ${material.path}`);
                      }}
                    />
                  )}
                </Collection>
              )}
            </View>
          );
        })}
      </Flex>
    </View>
  );
};