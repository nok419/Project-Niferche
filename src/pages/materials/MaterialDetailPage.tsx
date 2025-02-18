// src/pages/materials/MaterialDetailPage.tsx
import { useParams, useNavigate } from 'react-router-dom';
import { View, Heading, Text, Image, Card, Flex, Button } from '@aws-amplify/ui-react';
import { useEffect, useState } from 'react';

interface MaterialDoc {
  id: string;
  title: string;
  description: string;
  attribution: 'official' | 'shared';
  world: 'hodemei' | 'quxe' | 'alsarejia' | 'common';
  imagePath?: string;
  content?: string; // テキスト本文など
}

// 仮のダミーデータ
const MOCK_MATERIALS: MaterialDoc[] = [
  {
    id: 'doc001',
    title: 'Hodemeiの先端科学',
    description: 'Hodemei世界における科学技術のあれこれ',
    attribution: 'official',
    world: 'hodemei',
    imagePath: '/images/materials/tech-system.jpg',
    content: '詳細な科学設定や基礎理論について...'
  }
];

export const MaterialDetailPage = () => {
  const { attribution, world, materialId } = useParams();
  const navigate = useNavigate();

  const [doc, setDoc] = useState<MaterialDoc | null>(null);

  useEffect(() => {
    // 実際にはGraphQL / S3などから fetch
    const found = MOCK_MATERIALS.find(
      (item) =>
        item.id === materialId &&
        item.attribution === attribution &&
        item.world === world
    );
    setDoc(found || null);
  }, [attribution, world, materialId]);

  if (!doc) {
    return (
      <View padding="2rem" textAlign="center">
        <Heading level={3}>資料が見つかりません</Heading>
        <Button onClick={() => navigate(-1)} marginTop="1rem">
          戻る
        </Button>
      </View>
    );
  }

  return (
    <View padding="2rem">
      <Button 
        onClick={() => navigate(-1)} 
        marginBottom="1rem"
      >
        ← 一覧へ戻る
      </Button>

      <Card variation="elevated">
        <Flex direction="column" gap="small">
          <Heading level={2}>{doc.title}</Heading>
          <Text>
            {doc.attribution === 'official' ? '公式資料' : '共有資料'} / {doc.world}
          </Text>
          {doc.imagePath && (
            <Image
              src={doc.imagePath}
              alt={doc.title}
              width="100%"
              maxHeight="300px"
              objectFit="cover"
            />
          )}
          <Text marginTop="1rem">{doc.description}</Text>

          {doc.content && (
            <Text marginTop="1rem" whiteSpace="pre-wrap">
              {doc.content}
            </Text>
          )}
        </Flex>
      </Card>
    </View>
  );
};
