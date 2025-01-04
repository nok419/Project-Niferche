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
 import { DetailModal } from '../../components/common/DetailModal';
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
  details?: {
    title: string;
    content: string;
  }[];
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
    tags: ['共鳴', '相互作用', '理論研究'],
    details: [
      {
        title: '研究目的',
        content: 'アイデア体間の共鳴現象の特性を明らかにし、その影響範囲を定量的に評価することを目的とする。'
      },
      {
        title: '観測手法',
        content: '複数のアイデア体を同時に観測し、その相互作用を記録。現実性強度の変動パターンを分析。'
      },
      {
        title: '結論',
        content: '共鳴現象は双方のアイデア体の現実性を一時的に強化する効果があることが確認された。'
      }
    ]
  }
 ];
 
 export const ArchivePage = () => {
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedRecord, setSelectedRecord] = useState<ResearchRecord | null>(null);
  const { tokens } = useTheme();
 
  const filteredRecords = mockRecords.filter(record => 
    categoryFilter === 'all' || record.category === categoryFilter
  );
 
  const getStatusVariation = (status: ResearchRecord['status']): "info" | "error" | "warning" | "success" => {
    switch (status) {
      case 'verified': return 'success';
      case 'under_review': return 'warning';
      case 'theoretical': return 'info';
      default: return 'info';
    }
   };
 
  const getStatusLabel = (status: ResearchRecord['status']) => {
    switch (status) {
      case 'verified': return '検証済';
      case 'under_review': return '査読中';
      case 'theoretical': return '理論研究';
      default: return status;
    }
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
              onClick={() => setSelectedRecord(record)}
              style={{ cursor: 'pointer' }}
            >
              <Flex direction="column" gap="small">
                <Flex justifyContent="space-between" alignItems="center">
                  <Heading level={3}>{record.title}</Heading>
                    <Badge variation={getStatusVariation(record.status)}>
                      {getStatusLabel(record.status)}
                    </Badge>
                </Flex>
 
                <Text>{record.summary}</Text>
 
                <Text fontSize="small">
                  著者: {record.author} | 日付: {record.date}
                </Text>
 
                <Flex gap="small" wrap="wrap">
                  {record.tags.map(tag => (
                    <Badge 
                      key={tag} 
                      variation="info"
                    >
                      {tag}
                    </Badge>
                  ))}
                </Flex>
              </Flex>
            </Card>
          )}
        </Collection>
      </ContentSection>
 
      <DetailModal
        isOpen={!!selectedRecord}
        onClose={() => setSelectedRecord(null)}
        data={selectedRecord ? {
          id: selectedRecord.id,
          title: selectedRecord.title,
          description: selectedRecord.summary,
          category: selectedRecord.category,
          details: selectedRecord.details,
          metadata: {
            '著者': selectedRecord.author,
            '日付': selectedRecord.date,
            'ステータス': getStatusLabel(selectedRecord.status)
          },
          tags: selectedRecord.tags
        } : {
          id: '',
          title: '',
          description: '',
          category: '',
          tags: []
        }}
        entityType="research"
      />
    </View>
  );
 };