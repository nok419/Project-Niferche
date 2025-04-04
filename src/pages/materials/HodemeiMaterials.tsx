// src/pages/materials/HodemeiMaterials.tsx
import { useEffect, useState } from 'react';
import { MaterialsLayout } from '../../components/materials/MaterialsLayout';
import { Collection, View, ToggleButtonGroup, ToggleButton, Tabs, Button } from '@aws-amplify/ui-react';

import { AdvancedFilterPanel } from '../../components/common/AdvancedFilterPanel';
import { SkeletonList } from '../../components/common/SkeletonList';
import { ErrorAlert } from '../../components/common/ErrorAlert';
import { DocumentCard } from '../../components/materials/DocumentCard';
import { LibraryListViewItem } from '../../components/common/LibraryListViewItem';

import { useInfiniteContents } from '../../hooks/useInfiniteContents'; 
import { MaterialDocument } from '../../types/materials';

export const HodemeiMaterials = () => {
  // フィルタ条件
  const [filterCondition, setFilterCondition] = useState({
    keyword: '',
    world: 'all',
    tags: [] as string[],
  });

  // 表示モード
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  // attribution
  const [attribution, setAttribution] = useState<'official' | 'shared'>('official');
  // Tabs
  const [selectedCategory, setSelectedCategory] = useState('TECHNOLOGY');

  const {
    items,
    loadMore,
    hasMore,
    loading,
    error,
    resetItems, // 新しく追加(後述)
  } = useInfiniteContents();

  // フィルタ変更時に itemsをリセットして再取得するイメージ
  useEffect(() => {
    resetItems(); // itemsを空に
    loadMore({
      filter: {
        // 例: 
        //   and: [
        //     { worldType: { eq: "HODEMEI" } },
        //     { attribution: { eq: attribution === 'official' ? 'OFFICIAL' : 'SHARED' } },
        //     { or: [ { title: { matchPhrase: filterCondition.keyword } }, { description: {...} } ] }
        //   ]
      },
      limit: 6,
    });
  }, [filterCondition, attribution, resetItems, loadMore]);

  // GraphQLから取得した items を Document用にmapping
  const mappedItems: MaterialDocument[] = items.map((item) => ({
    id: item.id,
    title: item.title ?? 'No title',
    description: item.description ?? 'No desc',
    category: selectedCategory as any,
    reference: 'HOD-001',
    linkTo: `/materials/${attribution}/hodemei/${item.id}`,
    isAvailable: true,
    variant: 'document',
    imagePath: '/images/materials/tech-system.jpg',
  }));

  return (
    <MaterialsLayout
      title="Hodemei 設定資料"
      description="科学の極限を追求した世界、Hodemeiの資料を整理しています。"
    >
      <View padding="1rem">
        {/* アトリビューション */}
        <ToggleButtonGroup
          value={attribution}
          isExclusive
          onChange={(value) => setAttribution(value as 'official' | 'shared')}
          marginBottom="1rem"
        >
          <ToggleButton value="official">公式設定</ToggleButton>
          <ToggleButton value="shared">共有設定</ToggleButton>
        </ToggleButtonGroup>

        {/* 高度なフィルタ */}
        <AdvancedFilterPanel
          availableTags={['先端科学', 'ロボット', 'AI', '社会']}
          availableWorlds={['QUXE', 'HODEMEI', 'ALSAREJIA']}
          onChange={(newFilter) => setFilterCondition(newFilter)}
        />

        {/* ViewMode切り替え */}
        <ToggleButtonGroup
          value={viewMode}
          isExclusive
          onChange={(value) => setViewMode(value as 'grid' | 'list')}
          margin="1rem 0"
        >
          <ToggleButton value="grid">グリッド</ToggleButton>
          <ToggleButton value="list">リスト</ToggleButton>
        </ToggleButtonGroup>

        {/* タブ例 */}
        <Tabs
          spacing="equal"
          value={selectedCategory}
          onChange={(e) => {
            const target = e.target as HTMLButtonElement;
            setSelectedCategory(target.value);
          }}
        >
          <Tabs.List>
            <Tabs.Item value="TECHNOLOGY">科学技術</Tabs.Item>
            <Tabs.Item value="SOCIETY">社会構造</Tabs.Item>
            <Tabs.Item value="ORGANIZATION">組織</Tabs.Item>
            <Tabs.Item value="CHARACTER">キャラクター</Tabs.Item>
            <Tabs.Item value="LOCATION">地理</Tabs.Item>
            <Tabs.Item value="HISTORY">歴史</Tabs.Item>
          </Tabs.List>
        </Tabs>

        {/* エラー表示 */}
        {error && <ErrorAlert errorMessage={error.message || 'エラーが発生しました'} onDismiss={() => {}} />}

        {/* ローディング&表示 */}
        {loading && items.length === 0 ? (
          <SkeletonList count={4} />
        ) : (
          <>
            {viewMode === 'grid' && (
              <Collection
                type="grid"
                items={mappedItems}
                gap="medium"
                templateColumns={{
                  base: '1fr',
                  medium: '1fr 1fr',
                  large: '1fr 1fr 1fr',
                }}
              >
                {(item) => <DocumentCard key={item.id} {...item} />}
              </Collection>
            )}

            {viewMode === 'list' && (
              <Collection
                type="list"
                items={mappedItems}
                gap="small"
              >
                {(item) => (
                  <LibraryListViewItem
                    key={item.id}
                    id={item.id}
                    title={item.title}
                    description={item.description}
                    isAvailable={item.isAvailable}
                    reference={item.reference}
                    linkTo={item.linkTo}
                    category={item.category}
                  />
                )}
              </Collection>
            )}
          </>
        )}

        {/* Load More */}
        {hasMore && !loading && (
          <Button onClick={() => loadMore()} marginTop="1rem">
            さらに読み込む
          </Button>
        )}

        {loading && items.length > 0 && (
          <View marginTop="1rem">
            <SkeletonList count={2} />
          </View>
        )}
      </View>
    </MaterialsLayout>
  );
};
