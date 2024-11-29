import { useEffect, useState } from 'react';
import {
  View,
  Heading,
  Flex,
  Collection,
  SelectField,
  SearchField,
  Pagination,
  Grid
} from '@aws-amplify/ui-react';
import { StorageService } from '../../services/storage';
import { ContentCard } from '../../components/common/ContentCard';

interface GalleryItem {
  id: string;
  path: string;
  title: string;
  type: 'image' | 'story' | 'music' | 'other';
  tags: string[];
  thumbnail?: string;
}

export const GalleryPage = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [filter, setFilter] = useState<GalleryItem['type'] | 'all'>('all');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const itemsPerPage = 12;

  useEffect(() => {
    const loadGalleryItems = async () => {
      try {
        setLoading(true);
        const galleryItems = await StorageService.listFiles('gallery/');
        
        // ファイル名から情報を抽出してGalleryItemを構築
        const formattedItems: GalleryItem[] = galleryItems.map(item => ({
          id: item.path.split('/').pop() || '',
          path: item.path,
          title: item.path.split('/').pop()?.replace(/\.[^/.]+$/, '') || 'Untitled',
          type: getTypeFromPath(item.path),
          tags: [], // タグシステムは後で実装
          thumbnail: getThumbnailPath(item.path)
        }));

        setItems(formattedItems);
        setError(null);
      } catch (err) {
        setError('ギャラリーアイテムの読み込みに失敗しました');
        console.error('Error loading gallery items:', err);
      } finally {
        setLoading(false);
      }
    };

    loadGalleryItems();
  }, []);

  // パスからアイテムタイプを判定
  const getTypeFromPath = (path: string): GalleryItem['type'] => {
    const ext = path.split('.').pop()?.toLowerCase() || '';
    if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) return 'image';
    if (['md', 'txt'].includes(ext)) return 'story';
    if (['mp3', 'wav'].includes(ext)) return 'music';
    return 'other';
  };

  // サムネイルパスを生成
  const getThumbnailPath = (path: string): string => {
    const type = getTypeFromPath(path);
    if (type === 'image') return path;
    // 他のタイプのデフォルトサムネイル
    return `/images/thumbnails/${type}-default.jpg`;
  };

  // フィルタリングと検索を適用
  const filteredItems = items.filter(item => {
    const matchesFilter = filter === 'all' || item.type === filter;
    const matchesSearch = search === '' || 
      item.title.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // ページネーション
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const currentItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return <View padding="medium">Loading...</View>;
  }

  if (error) {
    return <View padding="medium">{error}</View>;
  }

  return (
    <View padding="medium">
      <Heading level={1} marginBottom="large">ギャラリー</Heading>

      <Flex direction="column" gap="large">
        {/* フィルターとサーチ */}
        <Grid
          templateColumns={{ base: "1fr", medium: "1fr 1fr" }}
          gap="medium"
        >
          <SelectField
            label="フィルター"
            value={filter}
            onChange={e => setFilter(e.target.value as GalleryItem['type'] | 'all')}
          >
            <option value="all">すべて</option>
            <option value="image">画像</option>
            <option value="story">ストーリー</option>
            <option value="music">音楽</option>
            <option value="other">その他</option>
          </SelectField>

          <SearchField
            label="検索"
            placeholder="タイトルで検索..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </Grid>

        {/* ギャラリーグリッド */}
        <Collection
          type="grid"
          items={currentItems}
          gap="medium"
          templateColumns={{
            base: "1fr",
            small: "1fr 1fr",
            medium: "1fr 1fr 1fr",
            large: "repeat(4, 1fr)"
          }}
        >
          {(item) => (
            <ContentCard
              key={item.id}
              title={item.title}
              imagePath={item.thumbnail}
              onClick={() => {
                // 詳細表示の処理（後で実装）
                console.log(`Opening ${item.path}`);
              }}
            />
          )}
        </Collection>

        {/* ページネーション */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onNext={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
            onPrevious={() => setCurrentPage(p => Math.max(p - 1, 1))}
            onChange={setCurrentPage}
          />
        )}
      </Flex>
    </View>
  );
};