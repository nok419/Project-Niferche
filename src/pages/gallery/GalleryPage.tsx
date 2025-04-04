// src/pages/gallery/GalleryPage.tsx
import { useEffect, useState } from 'react';
import {
  View,
  Heading,
  ToggleButtonGroup,
  ToggleButton,
  Collection,
  Button,
} from '@aws-amplify/ui-react';

import { AdvancedFilterPanel } from '../../components/common/AdvancedFilterPanel';
import { SkeletonList } from '../../components/common/SkeletonList';
import { ErrorAlert } from '../../components/common/ErrorAlert';
import { LibraryListViewItem } from '../../components/common/LibraryListViewItem';
import { ContentCard } from '../../components/common/ContentCard';
import { useInfiniteContents } from '../../hooks/useInfiniteContents';

interface GalleryItem {
  id: string;
  path: string;
  title: string;
  description?: string;
  category: string;
  tags: string[];
  isAvailable: boolean;
}

export const GalleryPage = () => {
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
        // e.g. category eq "illustration" など
      },
      limit: 6,
    });
  }, [filterCondition, resetItems, loadMore]);

  const mappedItems: GalleryItem[] = items.map((item) => ({
    id: item.id,
    path: '/images/sc.jpg',  // ダミー
    title: item.title ?? 'No Title',
    description: item.description,
    category: item.primaryCategory ?? 'illustration',
    tags: item.tags ?? [],
    isAvailable: true,
  }));

  return (
    <View width="100%" minHeight="100vh" padding="1rem">
      <Heading level={1} marginBottom="1rem">
        ギャラリー
      </Heading>

      <AdvancedFilterPanel
        availableTags={['キャラクター', '風景', 'Quxe', 'Alsarejia']}
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
              {(item) => (
                <ContentCard
                  key={item.id}
                  title={item.title}
                  description={item.description}
                  imagePath={item.path}
                  linkTo={`/gallery/view/${item.id}`}
                />
              )}
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
                  linkTo={`/gallery/view/${item.id}`}
                  category={item.category}
                  tags={item.tags}
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
  );
};