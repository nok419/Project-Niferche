// src/pages/materials/CommonSettings.tsx
import { MaterialsLayout } from '../../components/materials/MaterialsLayout';
import { Collection, View } from '@aws-amplify/ui-react';
import { DocumentCard } from '../../components/materials/DocumentCard';
import { DocumentFilter } from '../../components/materials/DocumentFilter';
import { useState } from 'react';
import { MaterialDocument } from '../../types/materials';

const commonSections: MaterialDocument[] = [
  {
    id: 'ideaspace',
    title: 'アイデア空間理論',
    description: '存在の構造と意味論的定義の曖昧性に関する示唆',
    category: 'THEORY',
    reference: 'COM-001',
    linkTo: '/materials/common/ideaspace',
    isAvailable: true,
    variant: 'manuscript'
  },
  {
    id: 'reality',
    title: '現実性理論',
    description: '観測と実在の関係、共鳴効果や減衰効果による自己確立',
    category: 'THEORY',
    reference: 'COM-002',
    linkTo: '/materials/common/reality',
    isAvailable: true,
    variant: 'manuscript'
  },
  // ... 他のセクション
];

export const CommonSettings = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredContent = commonSections.filter((item: MaterialDocument) => {
    const matchesSearch = searchTerm === '' || 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesCategory = selectedCategory === 'all' || 
      item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <MaterialsLayout
      title="共通設定資料"
      description="Project Nifercheの基盤となる理論体系と言語システムについて解説します。"
    >
      <View padding="1rem">
        <DocumentFilter
          onSearch={setSearchTerm}
          onCategoryChange={setSelectedCategory}
          onViewChange={setViewMode}
          onSortChange={() => {}}
        />
        
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
            <DocumentCard {...item} key={item.id} />
          )}
        </Collection>
      </View>
    </MaterialsLayout>
  );
};