// src/pages/laboratory/FacilityGuide.tsx
import React, { useState,FormEvent } from 'react';
import { Collection, View, Tabs, Card, Text, Image, Heading, Flex, Badge } from '@aws-amplify/ui-react';
import type { LabDocument } from '../../types/laboratory';

const facilityDocs: LabDocument[] = [
  {
    id: 'facility-map',
    title: '施設マップ',
    description: 'アルサレジア研究所の全体マップです',
    category: 'FACILITY',
    reference: 'FAC-001',
    isAvailable: true,
    variant: 'image',
    imagePath: '/images/laboratory/facility-map.jpg'
  },
  {
    id: 'facility-rules',
    title: '利用規約',
    description: '研究所の利用に関する基本的な規則と注意事項',
    category: 'RULES',
    reference: 'FAC-002',
    isAvailable: true,
    variant: 'document'
  },
  {
    id: 'facility-security',
    title: 'セキュリティガイド',
    description: '研究所内での安全管理と機密情報の取り扱いについて',
    category: 'FACILITY',
    reference: 'FAC-003', 
    isAvailable: true,
    variant: 'document'
  },
  {
    id: 'facility-resources',
    title: '設備・リソース',
    description: '利用可能な研究設備とリソースの一覧',
    category: 'FACILITY',
    reference: 'FAC-004',
    isAvailable: false,
    variant: 'document'
  }
];

interface TabInfo {
  id: string;
  label: string;
  value: string;
}

const tabs: TabInfo[] = [
  { id: 'overview', label: '概要', value: 'overview' },
  { id: 'areas', label: 'エリア案内', value: 'areas' },
  { id: 'rules', label: '利用規約', value: 'rules' }
];

export const FacilityGuide = () => {
  const [activeArea, setActiveArea] = useState<string>('overview');

  const handleTabChange = (event: FormEvent<HTMLDivElement>) => {
    const target = event.target as HTMLButtonElement;
    if (target.value) {
      setActiveArea(target.value);
    }
  };
  
  const getFilteredDocs = () => {
    return facilityDocs.filter(doc => {
      switch(activeArea) {
        case 'overview':
          return doc.variant === 'image';
        case 'areas':
          return doc.category === 'FACILITY';
        case 'rules':
          return doc.category === 'RULES';
        default:
          return false;
      }
    });
  };
  
    return (
    <View padding="2rem">
      <Flex direction="column" gap="medium">
        <Heading level={1}>研究施設案内</Heading>
        <Text>
          アルサレジア研究所の施設案内と利用に関する情報を提供しています。
        </Text>

        <Tabs
          value={activeArea}
          onChange={handleTabChange}
        >
          <Tabs.List>
            {tabs.map(tab => (
              <Tabs.Item
                key={tab.id}
                value={tab.value}
              >
                {tab.label}
              </Tabs.Item>
            ))}
          </Tabs.List>

          <View marginTop="medium">
            <Collection
              type="grid"
              items={facilityDocs.filter(doc => {
                switch(activeArea) {
                  case 'overview':
                    return doc.variant === 'image';
                  case 'areas':
                    return doc.category === 'FACILITY';
                  case 'rules':
                    return doc.category === 'RULES';
                  default:
                    return false;
                }
              })}
              gap="medium"
              templateColumns={{
                base: "1fr",
                medium: "1fr 1fr"
              }}
            >
              {(item: LabDocument) => (
                <Card 
                  key={item.id}
                  padding="medium"
                  variation="elevated"
                  backgroundColor={item.isAvailable ? 'white' : '#f5f5f5'}
                >
                  {item.variant === 'image' && item.imagePath && (
                    <Image 
                      src={item.imagePath}
                      alt={item.title}
                      width="100%"
                      objectFit="cover"
                    />
                  )}
                  <Flex direction="column" gap="small">
                    <Heading level={3}>{item.title}</Heading>
                    <Text>{item.description}</Text>
                    <Flex justifyContent="space-between" alignItems="center">
                      <Badge variation={item.isAvailable ? 'success' : 'warning'}>
                        {item.isAvailable ? '閲覧可能' : '準備中'}
                      </Badge>
                      <Text 
                        variation="tertiary"
                        fontSize="small"
                      >
                        {item.reference}
                      </Text>
                    </Flex>
                  </Flex>
                </Card>
              )}
            </Collection>
          </View>
        </Tabs>
      </Flex>
    </View>
  );
};