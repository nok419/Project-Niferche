// src/pages/materials/MaterialsAbout.tsx
import { useEffect, useState } from 'react';
import { MaterialsLayout } from '../../components/materials/MaterialsLayout';
import {
  View,
  ToggleButtonGroup,
  ToggleButton,
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

export const MaterialsAbout = () => {
  const [filterCondition, setFilterCondition] = useState({
    keyword: '',
    world: 'all',
    tags: [] as string[],
  });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const {
    items,
    loadMore,
    hasMore,
    loading,
    error,
    resetItems,
  } = useInfiniteContents();

  useEffect(() => {
    resetItems();
    loadMore({
      filter: {
        // 例: "SETTING_MATERIAL" など
      },
      limit: 6,
    });
  }, [filterCondition, resetItems, loadMore]);

  const mappedItems: MaterialDocument[] = items.map((item) => ({
    id: item.id,
    title: item.title ?? 'Materials Title',
    description: item.description ?? 'No description',
    category: 'WORLD',
    reference: 'REF-xxx',
    linkTo: `/materials/about/${item.id}`,
    isAvailable: true,
    variant: 'document',
    imagePath: '',
  }));

  return (
    <MaterialsLayout
      title="設定資料室"
      description="Project Nifercheの設定資料をご覧いただけます。"
    >
      <View padding="1rem">
        <AdvancedFilterPanel
          availableTags={['共通', 'Quxe', 'Hodemei', 'Alsarejia']}
          availableWorlds={['COMMON', 'QUXE', 'HODEMEI', 'ALSAREJIA']}
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

        {error && <ErrorAlert errorMessage={error} onDismiss={() => {}} />}

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
