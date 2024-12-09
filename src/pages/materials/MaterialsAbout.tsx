// src/pages/materials/MaterialsAbout.tsx
import { Collection, View } from '@aws-amplify/ui-react';
import { DocumentCard } from '../../components/materials/DocumentCard';
import { DocumentFilter } from '../../components/materials/DocumentFilter';
import { MaterialsLayout } from '../../components/materials/MaterialsLayout';
import { useState } from 'react';
import { MaterialDocument } from '../../types/materials';

const mainSections: MaterialDocument[] = [
  {
    id: 'common',
    title: '共通設定資料',
    description: '全ての世界に共通する基本法則や概念について',
    category: 'THEORY',
    reference: 'REF-001',
    linkTo: '/materials/common',
    isAvailable: true,
    variant: 'manuscript'
  },
  {
    id: 'quxe',
    title: 'Quxe World',
    description: '魔法と精霊の世界に関する設定資料',
    category: 'WORLD',
    reference: 'REF-002',
    linkTo: '/materials/quxe',
    isAvailable: true,
    variant: 'book'
  },
  {
    id: 'hodemei',
    title: 'Hodemei World',
    description: '科学と技術の未来世界に関する設定資料',
    category: 'WORLD',
    reference: 'REF-003',
    linkTo: '/materials/hodemei',
    isAvailable: true,
    variant: 'book'
  },
  {
    id: 'alsarejia',
    title: 'Alsarejia Research Facility',
    description: '研究施設に関する設定資料',
    category: 'WORLD',
    reference: 'REF-004',
    linkTo: '/materials/alsarejia',
    isAvailable: true,
    variant: 'document'
  }
];

export const MaterialsAbout = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredContent = mainSections.filter((item: MaterialDocument) => {
    const matchesSearch = searchTerm === '' || 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesCategory = selectedCategory === 'all' || 
      item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <MaterialsLayout
      title="設定資料室"
      description="Project Nifercheの設定資料をご覧いただけます。各項目は整理・分類されており、体系的に閲覧することができます。"
    >
      <View padding="1rem">
      <DocumentFilter
        onSearch={setSearchTerm}
        onCategoryChange={setSelectedCategory}
        onViewChange={setViewMode}  // onViewModeからonViewChangeに修正
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