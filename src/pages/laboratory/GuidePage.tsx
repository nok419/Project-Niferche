// src/pages/laboratory/GuidePage.tsx
import { 
  View, 
  Card, 
  Collection, 
  Text, 
  Heading,
  Button,
  Image,
  Flex,
  useTheme,
  ToggleButtonGroup, ToggleButton
} from '@aws-amplify/ui-react';
import { ContentSection } from '../../components/common/ContentSection';
import { useState } from 'react';

interface FacilityArea {
  id: string;
  name: string;
  description: string;
  category: 'research' | 'observation' | 'analysis' | 'common';
  accessLevel: 'all' | 'authorized' | 'restricted';
  features: string[];
  imagePath?: string;
}

const facilityAreas: FacilityArea[] = [
  {
    id: 'central-lab',
    name: '中央研究室',
    description: 'アイデア体の基本的な観測と記録を行うための主要施設です。',
    category: 'research',
    accessLevel: 'all',
    features: [
      '基本観測装置',
      'データ記録システム',
      'リアルタイムモニタリング'
    ],
    imagePath: '/images/facility/central-lab.jpg'
  },
  {
    id: 'analysis-center',
    name: '解析センター',
    description: '収集されたデータの分析と理論研究を行う施設です。',
    category: 'analysis',
    accessLevel: 'authorized',
    features: [
      '大規模データ分析システム',
      '理論研究支援AI',
      '共同研究スペース'
    ],
    imagePath: '/images/facility/analysis-center.jpg'
  }
  // ... 他の施設データ
];

export const GuidePage = () => {
  const [activeCategory, setActiveCategory] = useState<FacilityArea['category']>('research');
  const { tokens } = useTheme();

  const getAccessLevelBadgeProps = (level: FacilityArea['accessLevel']) => {
    switch (level) {
      case 'all':
        return { backgroundColor: tokens.colors.green[60], label: '一般利用可' };
      case 'authorized':
        return { backgroundColor: tokens.colors.blue[60], label: '許可制' };
      case 'restricted':
        return { backgroundColor: tokens.colors.red[60], label: '制限区域' };
    }
  };

  return (
    <View padding={tokens.space.large}>
      <ContentSection
        title="施設案内"
        description="Laboratory Alsarejiaの各施設・設備に関する案内です。"
      >
        <ToggleButtonGroup
          value={activeCategory}
          isExclusive
          onChange={(value) => setActiveCategory(value as FacilityArea['category'])}
          backgroundColor={tokens.colors.background.secondary}
          borderRadius="medium"
          padding="small"
        >
          <ToggleButton value="research">研究施設</ToggleButton>
          <ToggleButton value="observation">観測施設</ToggleButton>
          <ToggleButton value="analysis">解析施設</ToggleButton>
          <ToggleButton value="common">共用施設</ToggleButton>
        </ToggleButtonGroup>

        <Collection
          type="grid"
          items={facilityAreas.filter(area => area.category === activeCategory)}
          gap={tokens.space.medium}
          templateColumns={{
            base: "1fr",
            medium: "1fr 1fr"
          }}
        >
          {(area) => (
            <Card
              key={area.id}
              padding={tokens.space.medium}
              variation="elevated"
            >
              <Flex direction="column" gap="medium">
                {area.imagePath && (
                  <Image
                    src={area.imagePath}
                    alt={area.name}
                    width="100%"
                    height="200px"
                    objectFit="cover"
                    borderRadius="medium"
                  />
                )}

                <Flex justifyContent="space-between" alignItems="center">
                  <Heading level={3}>{area.name}</Heading>
                  <View
                    backgroundColor={getAccessLevelBadgeProps(area.accessLevel).backgroundColor}
                    padding="xs"
                    borderRadius="small"
                  >
                    <Text color="white" fontSize="small">
                      {getAccessLevelBadgeProps(area.accessLevel).label}
                    </Text>
                  </View>
                </Flex>

                <Text>{area.description}</Text>

                <View backgroundColor={tokens.colors.background.secondary} padding="medium" borderRadius="small">
                  <Text fontWeight="bold" marginBottom="small">主要設備:</Text>
                  {area.features.map((feature, index) => (
                    <Text key={index} fontSize="small">• {feature}</Text>
                  ))}
                </View>

                <Button variation="link">
                  詳細情報を表示
                </Button>
              </Flex>
            </Card>
          )}
        </Collection>
      </ContentSection>
    </View>
  );
};