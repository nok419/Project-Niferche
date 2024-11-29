import { useEffect, useState } from 'react';
import { 
  View, 
  Heading, 
  Flex, 
  Collection,
  Divider,
  Text,
  SelectField
} from '@aws-amplify/ui-react';
import { StorageService } from '../../services/storage';
import { ContentCard } from '../../components/common/ContentCard';

interface MaterialItem {
  path: string;
  title: string;
  category: string;
  type: 'magic' | 'artifact' | 'character' | 'organization' | 'map' | 'history';
}

export const QuxeMaterials = () => {
  const [materials, setMaterials] = useState<MaterialItem[]>([]);
  const [filter, setFilter] = useState<MaterialItem['type'] | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMaterials = async () => {
      try {
        setLoading(true);
        
        // 各カテゴリのコンテンツを読み込み
        const basePath = 'materials/official/unique/quxe';
        const categories = {
          magic: 'majic',
          artifact: 'artifact',
          character: 'characters',
          organization: 'organisation',
          map: 'maps',
          history: 'history'
        };

        let allMaterials: MaterialItem[] = [];

        for (const [type, folder] of Object.entries(categories)) {
          const items = await StorageService.listFiles(`${basePath}/${folder}/`);
          const formatted = items.map(item => ({
            path: item.path,
            title: item.path.split('/').pop()?.replace(/\.[^/.]+$/, '') || 'Untitled',
            category: getCategoryName(type as MaterialItem['type']),
            type: type as MaterialItem['type']
          }));
          allMaterials = [...allMaterials, ...formatted];
        }

        setMaterials(allMaterials);
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

  const getCategoryName = (type: MaterialItem['type']): string => {
    const categoryNames = {
      magic: '魔法',
      artifact: '魔法道具',
      character: 'キャラクター',
      organization: '組織',
      map: '地図',
      history: '歴史'
    };
    return categoryNames[type];
  };

  const filteredMaterials = materials.filter(
    material => filter === 'all' || material.type === filter
  );

  if (loading) {
    return <View padding="medium">Loading...</View>;
  }

  if (error) {
    return <View padding="medium">{error}</View>;
  }

  return (
    <View padding="medium">
      <Flex direction="column" gap="large">
        <SelectField
          label="カテゴリーフィルター"
          value={filter}
          onChange={e => setFilter(e.target.value as typeof filter)}
        >
          <option value="all">すべて表示</option>
          <option value="magic">魔法</option>
          <option value="artifact">魔法道具</option>
          <option value="character">キャラクター</option>
          <option value="organization">組織</option>
          <option value="map">地図</option>
          <option value="history">歴史</option>
        </SelectField>

        {filteredMaterials.length === 0 ? (
          <Text>表示する設定資料がありません</Text>
        ) : (
          <Collection
            type="grid"
            items={filteredMaterials}
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
      </Flex>
    </View>
  );
};