// src/pages/materials/QuxeMaterials.tsx
import { useEffect, useState } from 'react';
import { MaterialsLayout } from '../../components/materials/MaterialsLayout';
import {
  View,
  ToggleButtonGroup,
  ToggleButton,
  Tabs,
  Collection,
  Button,
} from '@aws-amplify/ui-react';

import { AdvancedFilterPanel } from '../../components/common/AdvancedFilterPanel';
import { SkeletonList } from '../../components/common/SkeletonList';
import { ErrorAlert } from '../../components/common/ErrorAlert';
import { LibraryListViewItem } from '../../components/common/LibraryListViewItem';
import { DocumentCard } from '../../components/materials/DocumentCard';

import { useInfiniteContents } from '../../hooks/useInfiniteContents';
import { MaterialDocument } from '../../types/materials';

export const QuxeMaterials = () => {
  const [filterCondition, setFilterCondition] = useState({
    keyword: '',
    world: 'all',
    tags: [] as string[],
  });

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [attribution, setAttribution] = useState<'official' | 'shared'>('official');

  // 選択中のタブ（Quxe内のカテゴリ）  
  const [selectedCategory, setSelectedCategory] = useState('MAGIC');

  const {
    items,
    loadMore,
    hasMore,
    loading,
    error,
    resetItems,
  } = useInfiniteContents();

  // フィルタ/タブ変更ごとにリセット&再ロード
  useEffect(() => {
    resetItems();
    loadMore({
      filter: {
        // 例: QUXEコンテンツのみ読みたい等 => worldType eq "QUXE"
      },
      limit: 6,
    });
  }, [filterCondition, attribution, selectedCategory, resetItems, loadMore]);

  // ダミー変換
  const mappedItems: MaterialDocument[] = items.map((item) => ({
    id: item.id,
    title: item.title ?? 'Untitled Quxe',
    description: item.description ?? 'No description',
    category: selectedCategory as any,
    reference: 'QUX-XXX',
    linkTo: `/materials/${attribution}/quxe/${item.id}`,
    isAvailable: true,
    variant: 'document',
    imagePath: '/images/materials/magic-basics.jpg',
  }));

  return (
    <MaterialsLayout
      title="Quxe 設定資料"
      description="魔法と精霊が織りなす神秘的な世界、Quxeの資料を整理しています。"
    >
      <View padding="1rem">
        <ToggleButtonGroup
          value={attribution}
          isExclusive
          onChange={(value) => setAttribution(value as 'official' | 'shared')}
          marginBottom="1rem"
        >
          <ToggleButton value="official">公式設定</ToggleButton>
          <ToggleButton value="shared">共有設定</ToggleButton>
        </ToggleButtonGroup>

        <AdvancedFilterPanel
          availableTags={['魔法基礎', '精霊', '呪文', '歴史']}
          availableWorlds={['QUXE', 'HODEMEI', 'ALSAREJIA']}
          onChange={(newFilter) => setFilterCondition(newFilter)}
        />

        <ToggleButtonGroup
          value={viewMode}
          isExclusive
          onChange={(value) => setViewMode(value as 'grid' | 'list')}
          margin="1rem 0"
        >
          <ToggleButton value="grid">グリッド</ToggleButton>
          <ToggleButton value="list">リスト</ToggleButton>
        </ToggleButtonGroup>

        <Tabs
          spacing="equal"
          value={selectedCategory}
          onChange={(e) => {
            const target = e.target as HTMLButtonElement;
            setSelectedCategory(target.value);
          }}
        >
          <Tabs.List>
            <Tabs.Item value="MAGIC">魔法体系</Tabs.Item>
            <Tabs.Item value="ARTIFACT">魔法道具</Tabs.Item>
            <Tabs.Item value="ORGANIZATION">組織</Tabs.Item>
            <Tabs.Item value="CHARACTER">キャラクター</Tabs.Item>
            <Tabs.Item value="LOCATION">地理</Tabs.Item>
            <Tabs.Item value="HISTORY">歴史</Tabs.Item>
          </Tabs.List>
        </Tabs>

        {error && <ErrorAlert errorMessage={error.message || 'エラーが発生しました'} onDismiss={() => {}} />}

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
              <Collection type="list" items={mappedItems} gap="small">
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

        {hasMore && !loading && (
          <Button onClick={() => loadMore()} marginTop="1rem">
            さらに読み込む
          </Button>
        )}
        {loading && items.length > 0 && <SkeletonList count={2} />}
      </View>
    </MaterialsLayout>
  );
};
