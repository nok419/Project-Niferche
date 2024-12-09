// src/pages/materials/QuxeMaterials.tsx
import { MaterialsLayout } from '../../components/materials/MaterialsLayout';
import { Collection, View, ToggleButtonGroup, ToggleButton, Tabs } from '@aws-amplify/ui-react';
import { DocumentCard } from '../../components/materials/DocumentCard';
import { DocumentFilter } from '../../components/materials/DocumentFilter';
import { useState } from 'react';
import { MaterialDocument, MaterialCategory } from '../../types/materials';

const quxeContents: MaterialDocument[] = [
  {
    id: 'magic-basics',
    title: '魔法の基礎',
    description: 'Quxeの魔法システムの基本概念と分類体系',
    category: 'MAGIC',
    reference: 'QUX-001',
    linkTo: '/materials/quxe/magic-basics',
    isAvailable: true,
    variant: 'manuscript',
    imagePath: '/images/materials/magic-basics.jpg'
  },
  {
    id: 'magic-elements',
    title: '魔法の属性',
    description: '魔法属性とその相互作用について',
    category: 'MAGIC',
    reference: 'QUX-002',
    linkTo: '/materials/quxe/magic-elements',
    isAvailable: true,
    variant: 'manuscript',
    imagePath: '/images/materials/magic-elements.jpg'
  },
  // ... 他のコンテンツ
];

export const QuxeMaterials = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<MaterialCategory>('MAGIC');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [attribution, setAttribution] = useState<'official' | 'shared'>('official');

  const filteredContent = quxeContents.filter((item) => {
    const matchesSearch = searchTerm === '' || 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesCategory = item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <MaterialsLayout
      title="Quxe 設定資料"
      description="魔法と精霊が織りなす神秘的な世界、Quxeの資料を整理しています。"
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