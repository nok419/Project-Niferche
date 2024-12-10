// src/pages/laboratory/FacilityGuide.tsx
import React, { useState } from 'react';
import { 
  View, 
  Card, 
  Flex, 
  useTheme,
  Button
} from '@aws-amplify/ui-react';

// 施設ドキュメントの型定義
interface FacilityDocument {
  id: string;
  title: string;
  description: string;
  category: 'overview' | 'areas' | 'rules';
  reference: string;
  isAvailable: boolean;
  variant: 'image' | 'document';
  imagePath?: string;
  link?: string;
}

// 施設ドキュメントデータ
const facilityDocs: FacilityDocument[] = [
  {
    id: 'facility-map',
    title: '施設マップ',
    description: 'アルサレジア研究所の全体マップです。各エリアの配置と主要な設備の位置を確認できます。',
    category: 'overview',
    reference: 'FAC-001',
    isAvailable: true,
    variant: 'image',
    imagePath: '/images/laboratory/facility-map.jpg',
    link: '/laboratory/facility/map'
  },
  {
    id: 'facility-security',
    title: 'セキュリティガイド',
    description: '研究所内での安全管理と機密情報の取り扱いについての詳細なガイドラインです。',
    category: 'areas',
    reference: 'FAC-003',
    isAvailable: true,
    variant: 'document',
    link: '/laboratory/facility/security'
  },
  {
    id: 'facility-rules',
    title: '利用規約',
    description: '研究所の利用に関する基本的な規則と注意事項をまとめています。',
    category: 'rules',
    reference: 'FAC-002',
    isAvailable: true,
    variant: 'document',
    link: '/laboratory/facility/rules'
  }
];

export const FacilityGuide: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<FacilityDocument['category']>('overview');
  const { tokens } = useTheme();

  // タブボタンインターフェース
  interface TabItem {
    id: FacilityDocument['category'];
    label: string;
  }

  // タブボタンのレンダリング
  const renderTab = (tab: TabItem) => (
    <Button
      key={tab.id}
      onClick={() => setActiveCategory(tab.id)}
      backgroundColor={activeCategory === tab.id ? 
        tokens.colors.background.primary : 'transparent'}
      color={activeCategory === tab.id ? 
        tokens.colors.font.primary : tokens.colors.font.secondary}
      borderRadius="small"
      padding="0.75rem 1.5rem"
      variation="link"
    >
      {tab.label}
    </Button>
  );

  // カードのレンダリング
  const renderCard = (item: FacilityDocument) => (
    <Card
      key={item.id}
      padding="0"
      variation="elevated"
      backgroundColor={tokens.colors.background.primary}
      style={{
        flex: '1 1 400px',
        minHeight: '300px',
        cursor: item.isAvailable ? 'pointer' : 'default'
      }}
      onClick={() => item.isAvailable && item.link && window.location.assign(item.link)}
    >
      {/* ... カードの中身は同じ ... */}
    </Card>
  );

  const tabs: TabItem[] = [
    { id: 'overview', label: '概要' },
    { id: 'areas', label: 'エリア案内' },
    { id: 'rules', label: '利用規約' }
  ];

  return (
    <View 
      padding={{ base: '1rem', medium: '2rem' }}
      backgroundColor={tokens.colors.background.secondary}
    >
      {/* ... 他の部分は同じ ... */}
      
      <Flex 
        gap="medium" 
        marginBottom="2rem"
        backgroundColor={tokens.colors.background.tertiary}
        padding="0.5rem"
        borderRadius="small"
      >
        {tabs.map(tab => renderTab(tab))}
      </Flex>

      <Flex 
        gap="medium"
        wrap="wrap"
      >
        {facilityDocs
          .filter(doc => doc.category === activeCategory)
          .map(item => renderCard(item))}
      </Flex>
    </View>
  );
};