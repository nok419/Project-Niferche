// src/pages/library/RecordsPage.tsx
import { useState } from 'react';
import { View, Heading, Collection, Card, Text, Badge, Flex, Button } from '@aws-amplify/ui-react';
import { useNavigate } from 'react-router-dom';

interface RecordItem {
  id: string;
  title: string;
  description: string;
  category: 'theory' | 'experiment' | 'observation' | 'misc';
  status: 'open' | 'closed';
  date: string;
}

const mockRecords: RecordItem[] = [
  {
    id: 'r-001',
    title: 'アイデア体の共鳴現象',
    description: '複数のアイデア体を同時観測した際の共鳴現象研究ノート',
    category: 'experiment',
    status: 'open',
    date: '2024-03-10'
  },
  {
    id: 'r-002',
    title: '境界領域に関する考察',
    description: '現実と想像の狭間における不思議な干渉のレポート',
    category: 'theory',
    status: 'closed',
    date: '2024-02-28'
  }
];

export const RecordsPage = () => {
  const [filter, setFilter] = useState<'all' | 'open' | 'closed'>('all');
  const navigate = useNavigate();

  const filtered = mockRecords.filter(rec => {
    if (filter === 'all') return true;
    return rec.status === filter;
  });

  return (
    <View padding="2rem">
      <Heading level={1} marginBottom="1rem">
        研究記録集
      </Heading>
      <Text marginBottom="1rem">
        Laboratoryで記録された研究データや実験結果を閲覧できます。
      </Text>

      <Flex gap="small" marginBottom="1rem">
        <Button
          onClick={() => setFilter('all')}
          variation={filter === 'all' ? 'primary' : 'link'}
        >
          全て
        </Button>
        <Button
          onClick={() => setFilter('open')}
          variation={filter === 'open' ? 'primary' : 'link'}
        >
          公開中
        </Button>
        <Button
          onClick={() => setFilter('closed')}
          variation={filter === 'closed' ? 'primary' : 'link'}
        >
          閲覧終了
        </Button>
      </Flex>

      <Collection type="list" items={filtered} gap="small">
        {(item) => (
          <Card key={item.id} variation="elevated" padding="1rem">
            <Flex direction="column" gap="xsmall">
              <Heading level={3}>{item.title}</Heading>
              <Text>{item.description}</Text>
              <Flex gap="small" alignItems="center">
                <Badge variation={item.status === 'open' ? 'success' : 'warning'}>
                  {item.status === 'open' ? '公開中' : '閲覧終了'}
                </Badge>
                <Badge variation="info">{item.category}</Badge>
                <Text fontSize="small" color="font.tertiary">
                  {item.date}
                </Text>
              </Flex>
            </Flex>
          </Card>
        )}
      </Collection>

      <Button onClick={() => navigate('/library')} marginTop="2rem" variation="link">
        ライブラリトップへ戻る
      </Button>
    </View>
  );
};
