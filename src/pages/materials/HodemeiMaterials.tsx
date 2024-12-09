// src/pages/materials/HodemeiMaterials.tsx
import { MaterialsLayout } from '../../components/materials/MaterialsLayout';
import { Collection, View, ToggleButtonGroup, ToggleButton, Tabs } from '@aws-amplify/ui-react';
import { DocumentCard } from '../../components/materials/DocumentCard';
import { DocumentFilter } from '../../components/materials/DocumentFilter';
import { useState } from 'react';
import { MaterialDocument, MaterialCategory } from '../../types/materials';

const hodemeiContents: MaterialDocument[] = [
  {
    id: 'tech-system',
    title: '科学技術体系',
    description: 'Hodemeiにおける科学技術の発展と分類',
    category: 'TECHNOLOGY',
    reference: 'HOD-001',
    linkTo: '/materials/hodemei/tech-system',
    isAvailable: true,
    variant: 'document',
    imagePath: '/images/materials/tech-system.jpg'
  },
  // ... 他のコンテンツ
];

export const HodemeiMaterials = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<MaterialCategory>('TECHNOLOGY');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [attribution, setAttribution] = useState<'official' | 'shared'>('official');

  const filteredContent = hodemeiContents.filter((item) => {
    const matchesSearch = searchTerm === '' || 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesCategory = item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <MaterialsLayout
      title="Hodemei 設定資料"
      description="科学の極限を追求した世界、Hodemeiの資料を整理しています"
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
          onCategoryChange={(category) => setSelectedCategory(category as MaterialCategory)}
          onViewChange={setViewMode}
          onSortChange={() => {}}
        />

        <Tabs
          spacing="equal"
          value={selectedCategory}
          onChange={(e) => {
            const target = e.target as HTMLButtonElement;
            if (target.value) {
              setSelectedCategory(target.value as MaterialCategory);
            }
          }}
        >
          <Tabs.List>
            <Tabs.Item value="MAGIC">魔法体系</Tabs.Item>
            <Tabs.Item value="ARTIFACT">魔法道具</Tabs.Item>
            <Tabs.Item value="ORGANIZATION">組織</Tabs.Item>
            <Tabs.Item value="CHARACTER">キャラクター</Tabs.Item>
            <Tabs.Item value="LOCATION">地理</Tabs.Item>
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
              linkTo={`/materials/${attribution}/quxe/${item.id}`}
            />
          )}
        </Collection>
      </View>
    </MaterialsLayout>
  );
};