// src/pages/laboratory/ArchivePage.tsx
import { 
  View, 
  Heading, 
  Card, 
  Collection,
  Text, 
  Badge,
  Flex,
  SelectField,
  useTheme 
} from '@aws-amplify/ui-react';
import { ContentSection } from '../../components/common/ContentSection';
import { useState } from 'react';

interface ResearchRecord {
  id: string;
  title: string;
  summary: string;
  category: 'observation' | 'analysis' | 'theory' | 'interaction';
  date: string;
  author: string;
  status: 'verified' | 'under_review' | 'theoretical';
  relatedEntities: string[];
  tags: string[];
}

const mockRecords: ResearchRecord[] = [
  {
    id: 'rec-001',
    title: 'アイデア体の共鳴現象に関する考察',
    summary: '複数のアイデア体間で観測された共鳴現象について、その特性と影響を分析する。',
    category: 'analysis',
    date: '2024-03-15',
    author: 'サレジア',
    status: 'verified',
    relatedEntities: ['idea-001', 'idea-003'],
    tags: ['共鳴', '相互作用', '理論研究']
  },
  // ... 他のモックデータ
];

export const ArchivePage = () => {
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const { tokens } = useTheme();

  const filteredRecords = mockRecords.filter(record => 
    categoryFilter === 'all' || record.category === categoryFilter
  );

  const StatusBadge = ({ status }: { status: ResearchRecord['status'] }) => {
    const statusConfig = {
      verified: { label: '検証済', variation: 'success' },
      under_review: { label: '査読中', variation: 'warning' },
      theoretical: { label: '理論研究', variation: 'info' }
    };

    const config = statusConfig[status];
    return <Badge variation={config.variation as any}>{config.label}</Badge>;
  };

  return (
    <View padding={tokens.space.large}>
      <ContentSection
        title="研究アーカイブ"
        description="アイデア体に関する研究記録や分析結果のアーカイブです。"
      >
        <Flex gap="medium" marginBottom="large">
          <SelectField
            label="カテゴリフィルター"
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
          >
            <option value="all">すべて表示</option>
            <option value="observation">観測記録</option>
            <option value="analysis">分析結果</option>
            <option value="theory">理論研究</option>
            <option value="interaction">相互作用</option>
          </SelectField>
        </Flex>

        <Collection
          type="grid"
          items={filteredRecords}
          gap={tokens.space.medium}
          templateColumns={{
            base: "1fr",
            medium: "1fr 1fr"
          }}
        >
          {(record) => (
            <Card
              key={record.id}
              padding={tokens.space.medium}
              variation="elevated"
            >
              <Flex direction="column" gap="small">
                <Flex justifyContent="space-between" alignItems="center">
                  <Heading level={3}>{record.title}</Heading>
                  <StatusBadge status={record.status} />
                </Flex>

                <Text color="font.secondary">{record.summary}</Text>

                <Text fontSize="small" color="font.tertiary">
                  著者: {record.author} | 日付: {record.date}
                </Text>

                <Flex gap="small" wrap="wrap">
                  {record.tags.map(tag => (
                    <Badge 
                      key={tag} 
                      variation="info"
                      backgroundColor={tokens.colors.background.secondary}
                    >
                      {tag}
                    </Badge>
                  ))}
                </Flex>

                <Flex justifyContent="flex-end">
                  <Text 
                    fontSize="small"
                    color="font.interactive"
                    style={{ cursor: 'pointer' }}
                  >
                    詳細を表示 →
                  </Text>
                </Flex>
              </Flex>
            </Card>
          )}
        </Collection>
      </ContentSection>
    </View>
  );
};