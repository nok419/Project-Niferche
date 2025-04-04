// src/pages/library/LibraryOverviewPage.tsx
import { useEffect, useState } from 'react';
import { View, Heading, Collection, Button, ToggleButtonGroup, ToggleButton } from '@aws-amplify/ui-react';
import { AdvancedFilterPanel } from '../../components/common/AdvancedFilterPanel';
import { SkeletonList } from '../../components/common/SkeletonList';
import { ErrorAlert } from '../../components/common/ErrorAlert';
import { LibraryListViewItem } from '../../components/common/LibraryListViewItem';
import { ContentCard } from '../../components/common/ContentCard'; // or any other card
import { useInfiniteContents } from '../../hooks/useInfiniteContents';

interface StoryOverview {
  id: string;
  title: string;
  description: string;
  status: string;
  thumbnailPath: string;
  isAvailable: boolean;
}

export const LibraryOverviewPage = () => {
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
        // 例: primaryCategory eq "MAIN_STORY" or "SIDE_STORY"
      },
      limit: 6,
    });
  }, [filterCondition, resetItems, loadMore]);

  const mappedItems: StoryOverview[] = items.map((item) => ({
    id: item.id,
    title: item.title ?? 'No Title',
    description: item.description ?? '',
    status: item.status ?? 'ongoing',
    thumbnailPath: '/images/main-story.jpg',
    isAvailable: true,
  }));

  return (
    <View padding="1rem">
      <Heading level={2} marginBottom="1rem">
        Library Overview
      </Heading>

      <AdvancedFilterPanel
        availableTags={['メイン', 'サイド', '研究']}
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
                  imagePath={item.thumbnailPath}
                  linkTo={`/library/${item.id}`}
                />
              )}
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
                  linkTo={`/library/${item.id}`}
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
