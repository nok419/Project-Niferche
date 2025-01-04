// src/pages/laboratory/GuidePage.tsx
import { 
  View, 
  Card, 
  Collection, 
  Text, 
  Heading,
  Image,
  Flex,
  useTheme,
  ToggleButtonGroup, 
  ToggleButton,
  Badge
 } from '@aws-amplify/ui-react';
 import { ContentSection } from '../../components/common/ContentSection';
 import { DetailModal } from '../../components/common/DetailModal';
 import { useState } from 'react';
 
 interface FacilityArea {
  id: string;
  name: string;
  description: string;
  category: 'research' | 'observation' | 'analysis' | 'common';
  accessLevel: 'all' | 'authorized' | 'restricted';
  features: string[];
  imagePath?: string;
  details?: {
    title: string;
    content: string;
  }[];
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
    imagePath: '/images/facility/central-lab.jpg',
    details: [
      {
        title: '設備概要',
        content: '最新の観測機器を備えた総合研究施設です。24時間体制で運営されています。'
      },
      {
        title: '利用方法',
        content: '基本的な利用は予約制となっています。緊急時は管理者に直接連絡してください。'
      }
    ]
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
    imagePath: '/images/facility/analysis-center.jpg',
    details: [
      {
        title: '主要設備',
        content: '大規模計算機システムと共同研究スペースを完備しています。'
      },
      {
        title: 'アクセス制限',
        content: '許可された研究者のみが利用できます。申請は管理部門で受け付けています。'
      }
    ]
  }
 ];
 
 export const GuidePage = () => {
  const [activeCategory, setActiveCategory] = useState<FacilityArea['category']>('research');
  const [selectedFacility, setSelectedFacility] = useState<FacilityArea | null>(null);
  const { tokens } = useTheme();
 
  const getAccessLevelConfig = (level: FacilityArea['accessLevel']): { variation: "info" | "warning" | "success", label: string } => {
    switch (level) {
      case 'all':
        return { variation: 'success', label: '一般利用可' };
      case 'authorized':
        return { variation: 'info', label: '許可制' };
      case 'restricted':
        return { variation: 'warning', label: '制限区域' };
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
              onClick={() => setSelectedFacility(area)}
              style={{ cursor: 'pointer' }}
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
                  <Badge 
                    variation={getAccessLevelConfig(area.accessLevel).variation}
                  >
                    {getAccessLevelConfig(area.accessLevel).label}
                  </Badge>
                </Flex>
 
                <Text>{area.description}</Text>
 
                <View backgroundColor={tokens.colors.background.secondary} padding="medium" borderRadius="small">
                  <Text fontWeight="bold" marginBottom="small">主要設備:</Text>
                  {area.features.map((feature, index) => (
                    <Text key={index} fontSize="small">• {feature}</Text>
                  ))}
                </View>
              </Flex>
            </Card>
          )}
        </Collection>
      </ContentSection>
 
      <DetailModal
        isOpen={!!selectedFacility}
        onClose={() => setSelectedFacility(null)}
        data={selectedFacility ? {
          id: selectedFacility.id,
          title: selectedFacility.name,
          description: selectedFacility.description,
          category: selectedFacility.category,
          imagePath: selectedFacility.imagePath,
          details: selectedFacility.details,
          metadata: {
            'アクセスレベル': getAccessLevelConfig(selectedFacility.accessLevel).label,
            '設備数': selectedFacility.features.length.toString()
          },
          tags: selectedFacility.features
        } : {
          id: '',
          title: '',
          description: '',
          category: '',
          tags: []
        }}
        entityType="facility"
      />
    </View>
  );
 };