// src/pages/gallery/GalleryDetailPage.tsx
import { useParams, useNavigate } from 'react-router-dom';
import { View, Heading, Text, Image, Button, Flex } from '@aws-amplify/ui-react';
import { useState, useEffect } from 'react';

/** 仮のギャラリーデータ */
interface GalleryItem {
  id: string;
  title: string;
  imagePath: string;
  description?: string;
}

// ダミー一覧（本来はバックエンド連携やuseInfiniteContents()で取得）
const GALLERY_DATA: GalleryItem[] = [
  {
    id: 'sample1',
    title: 'サンプル画像1',
    imagePath: '/images/sc.jpg',
    description: 'テスト用のイメージです'
  },
  {
    id: 'sample2',
    title: 'サンプル画像2',
    imagePath: '/images/fallback.jpg',
    description: 'もうひとつのテスト用イメージ'
  }
];

export const GalleryDetailPage = () => {
  const { galleryId } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState<GalleryItem | null>(null);

  useEffect(() => {
    // 仮: ダミーデータから検索
    const found = GALLERY_DATA.find((g) => g.id === galleryId);
    setItem(found || null);
  }, [galleryId]);

  if (!item) {
    return (
      <View padding="2rem" textAlign="center">
        <Heading level={3}>指定された画像が見つかりませんでした</Heading>
        <Button onClick={() => navigate('/gallery')} marginTop="1rem">
          ギャラリーへ戻る
        </Button>
      </View>
    );
  }

  return (
    <View padding="2rem" maxWidth="800px" margin="0 auto">
      <Button onClick={() => navigate('/gallery')} marginBottom="1rem">
        ← ギャラリー一覧に戻る
      </Button>

      <Flex direction="column" gap="medium" alignItems="center">
        <Heading level={2}>{item.title}</Heading>
        <Image
          src={item.imagePath}
          alt={item.title}
          objectFit="cover"
          width="100%"
          maxWidth="600px"
        />
        {item.description && (
          <Text>{item.description}</Text>
        )}
      </Flex>
    </View>
  );
};
