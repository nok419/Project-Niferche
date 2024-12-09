// src/pages/materials/AlsarejiaMaterials.tsx
import { MaterialsLayout } from '../../components/materials/MaterialsLayout';
import { Collection, View, ToggleButtonGroup, ToggleButton, Tabs } from '@aws-amplify/ui-react';
import { DocumentCard } from '../../components/materials/DocumentCard';
import { DocumentFilter } from '../../components/materials/DocumentFilter';
import { useState } from 'react';
import { MaterialDocument } from '../../types/materials';

// カテゴリの定義
export type AlsarejiaContentCategory = 
  'FACILITY' | 'IDEA' | 'TECH' | 'CHARACTER' | 'HISTORY';

// ベースとなるコンテンツ定義
const alsarejiaContents: MaterialDocument[] = [
  {
    id: 'facility-overview',
    title: '研究施設概要',
    description: '「Laboratory Alsarejia」の全体構造と主要施設',
    category: 'FACILITY',
    reference: 'ALS-001',
    linkTo: '/materials/alsarejia/facility-overview',
    isAvailable: true,
    variant: 'document',
    imagePath: '/images/materials/facility-overview.jpg',
  },
  {
    id: 'idea-basics',
    title: 'アイデア体の基礎',
    description: 'アイデア体の定義と基本的な性質',
    category: 'IDEA',
    reference: 'ALS-002',
    linkTo: '/materials/alsarejia/idea-basics',
    isAvailable: true,
    variant: 'manuscript',
    imagePath: '/images/materials/idea-basics.jpg',
  },
  // ... 他のコンテンツ定義
];

export const AlsarejiaMaterials = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<AlsarejiaContentCategory>('FACILITY');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [attribution, setAttribution] = useState<'official' | 'shared'>('official');

  const filteredContent = alsarejiaContents.filter((item: MaterialDocument) => {
    const matchesSearch = searchTerm === '' || 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesCategory = item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <MaterialsLayout
      title="Alsarejia 設定資料"
      description="全ての物語が交差する不思議な研究施設、Alsarejiaの資料を整理しています。"
    >
      <View padding="1rem">
        <ToggleButtonGroup
          value={attribution}
          isExclusive
          onChange={(value) => setAttribution(value as 'official' | 'shared')}
          marginBottom="1rem"
        >
          <ToggleButton value="official">公式設定</ToggleButton>
          <ToggleButton value="shared">共有設定</ToggleButton>
        </ToggleButtonGroup>

        <DocumentFilter
          onSearch={setSearchTerm}
          onCategoryChange={(category) => setSelectedCategory(category as AlsarejiaContentCategory)}
          onViewChange={setViewMode}
          onSortChange={() => {}}
        />

        <Tabs
          spacing="equal"
          value={selectedCategory}
          onChange={(e) => {
            const target = e.target as HTMLButtonElement;
            if (target.value) {
              setSelectedCategory(target.value as AlsarejiaContentCategory);
            }
          }}
        >
          <Tabs.List>
            <Tabs.Item value="FACILITY">研究施設</Tabs.Item>
            <Tabs.Item value="IDEA">アイデア体</Tabs.Item>
            <Tabs.Item value="TECH">特殊技術</Tabs.Item>
            <Tabs.Item value="CHARACTER">キャラクター</Tabs.Item>
            <Tabs.Item value="HISTORY">歴史</Tabs.Item>
          </Tabs.List>
        </Tabs>
        
        <Collection
          type={viewMode}
          items={filteredContent}
          gap="medium"
          templateColumns={viewMode === 'grid' ? {
            base: "1fr",
            medium: "1fr 1fr",
            large: "1fr 1fr 1fr"
          } : undefined}
        >
          {(item: MaterialDocument) => (
            <DocumentCard 
              {...item} 
              key={item.id}
              linkTo={`/materials/${attribution}/alsarejia/${item.id}`}
            />
          )}
        </Collection>
      </View>
    </MaterialsLayout>
  );
};