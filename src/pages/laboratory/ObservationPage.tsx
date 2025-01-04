// src/pages/laboratory/ObservationPage.tsx
import { 
  View, 
  Heading, 
  Collection,
  Card,
  Text,
  Badge,
  Flex,
  Button,
  useTheme,
  ToggleButtonGroup,
  ToggleButton
} from '@aws-amplify/ui-react';
import { ContentSection } from '../../components/common/ContentSection';
import { DetailModal } from '../../components/common/DetailModal';
import { useState } from 'react';

interface IdeaEntity {
  id: string;
  name: string;
  category: 'PHYSICAL' | 'MENTAL' | 'CONCEPTUAL';
  realityStrength: number;
  stabilityIndex: number;
  firstObservedAt: string;
  lastObservedAt: string;
  observationCount: number;
  status: 'stable' | 'unstable' | 'fluctuating';
  description: string;
  tags: string[];
  details?: {
    title: string;
    content: string;
  }[];
}

const mockIdeaEntities: IdeaEntity[] = [
  {
    id: 'idea-001',
    name: 'クリスタルメモリー',
    category: 'PHYSICAL',
    realityStrength: 0.75,
    stabilityIndex: 0.88,
    firstObservedAt: '2024-01-15',
    lastObservedAt: '2024-03-20',
    observationCount: 12,
    status: 'stable',
    description: '記憶を物質として結晶化させる現象。観測時の干渉により形状が変化する。',
    tags: ['結晶化', '記憶', '物質変容'],
    details: [
      {
        title: '基本特性',
        content: '記憶の結晶化現象は、特定の条件下で安定して観測されている。結晶の色や形状は、記憶の内容や強度によって変化する。'
      },
      {
        title: '観測履歴',
        content: '初回観測以降、12回の詳細な観測記録が存在。安定性は経時的に向上している。'
      }
    ]
  },
  // ... 他のモックデータ
];

export const ObservationPage = () => {
  const [activeCategory, setActiveCategory] = useState<IdeaEntity['category']>('PHYSICAL');
  const [selectedEntity, setSelectedEntity] = useState<IdeaEntity | null>(null);
  const { tokens } = useTheme();

  const RealityStrengthIndicator = ({ value }: { value: number }) => (
    <View
      backgroundColor={tokens.colors.background.secondary}
      padding="xxs"
      borderRadius="small"
      width="100px"
    >
      <View
        backgroundColor={
          value > 0.8 ? tokens.colors.green[60] :
          value > 0.5 ? tokens.colors.blue[60] :
          tokens.colors.red[60]
        }
        width={`${value * 100}%`}
        height="4px"
        borderRadius="small"
      />
    </View>
  );

  return (
    <View padding={tokens.space.large}>
      <ContentSection
        title="アイデア体観測システム"
        description="アイデア体の観測と記録を行うためのインターフェースです。"
      >
        <ToggleButtonGroup
          value={activeCategory}
          isExclusive
          onChange={(value) => setActiveCategory(value as IdeaEntity['category'])}
          backgroundColor={tokens.colors.background.secondary}
          borderRadius="medium"
          padding="small"
        >
          <ToggleButton value="PHYSICAL">物質形態</ToggleButton>
          <ToggleButton value="MENTAL">精神形態</ToggleButton>
          <ToggleButton value="CONCEPTUAL">概念形態</ToggleButton>
        </ToggleButtonGroup>

        <Button
          variation="primary"
          margin={tokens.space.medium}
        >
          + 新規アイデア体の登録
        </Button>

        <Collection
          type="grid"
          items={mockIdeaEntities.filter(entity => entity.category === activeCategory)}
          gap={tokens.space.medium}
          templateColumns={{
            base: "1fr",
            medium: "1fr 1fr"
          }}
        >
          {(entity) => (
            <Card
              key={entity.id}
              padding={tokens.space.medium}
              variation="elevated"
              onClick={() => setSelectedEntity(entity)}
              style={{ cursor: 'pointer' }}
            >
              <Flex direction="column" gap="small">
                <Flex justifyContent="space-between" alignItems="center">
                  <Heading level={3}>{entity.name}</Heading>
                  <Badge variation={
                    entity.status === 'stable' ? 'success' :
                    entity.status === 'unstable' ? 'error' :
                    'warning'
                  }>
                    {entity.status}
                  </Badge>
                </Flex>

                <Text>{entity.description}</Text>

                <Flex gap="small" alignItems="center">
                  <Text fontSize="small">現実性強度:</Text>
                  <RealityStrengthIndicator value={entity.realityStrength} />
                </Flex>

                <Flex gap="small" wrap="wrap">
                  {entity.tags.map(tag => (
                    <Badge key={tag} variation="info">{tag}</Badge>
                  ))}
                </Flex>

                <Flex justifyContent="space-between" fontSize="small">
                  <Text>観測回数: {entity.observationCount}</Text>
                  <Text>最終観測: {entity.lastObservedAt}</Text>
                </Flex>
              </Flex>
            </Card>
          )}
        </Collection>
      </ContentSection>

      <DetailModal
        isOpen={!!selectedEntity}
        onClose={() => setSelectedEntity(null)}
        data={selectedEntity ? {
          id: selectedEntity.id,
          title: selectedEntity.name,
          description: selectedEntity.description,
          category: selectedEntity.category,
          details: selectedEntity.details,
          metadata: {
            '現実性強度': `${selectedEntity.realityStrength * 100}%`,
            '安定性指数': `${selectedEntity.stabilityIndex * 100}%`,
            '観測回数': selectedEntity.observationCount.toString(),
            '初回観測': selectedEntity.firstObservedAt,
            '最終観測': selectedEntity.lastObservedAt
          },
          tags: selectedEntity.tags
        } : null}
        entityType="idea"
      />
    </View>
  );
};