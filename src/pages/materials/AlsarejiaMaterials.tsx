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
  type: 'room' | 'item' | 'technology' | 'character' | 'history';
}

export const AlsarejiaMaterials = () => {
  const [materials, setMaterials] = useState<MaterialItem[]>([]);
  const [filter, setFilter] = useState<MaterialItem['type'] | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMaterials = async () => {
      try {
        setLoading(true);
        
        const basePath = 'materials/official/unique/alsarejia';
        const categories = {
          room: 'rooms',
          item: 'items',
          technology: 'atechs',
          character: 'characters',
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
      room: '研究室・施設',
      item: 'アイデア体',
      technology: '特殊技術',
      character: 'キャラクター',
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
          <option value="room">研究室・施設</option>
          <option value="item">アイデア体</option>
          <option value="technology">特殊技術</option>
          <option value="character">キャラクター</option>
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