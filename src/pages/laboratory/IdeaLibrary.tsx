// src/pages/laboratory/IdeaLibrary.tsx
import React, { useState } from 'react';
import { 
  View, 
  Card, 
  Text, 
  Image, 
  Heading, 
  Flex, 
  Badge,
  useTheme
} from '@aws-amplify/ui-react';

const ideaDocs = [
  {
    id: 'idea-basics',
    title: 'アイデア体の基礎',
    description: 'アイデア体の基本的な性質と観測方法について解説します。研究を始める前に必ず確認してください。',
    category: 'basic',
    reference: 'IDE-001',
    isAvailable: true,
    variant: 'document',
    link: '/laboratory/ideas/basics',
    tags: ['入門', '基礎理論']
  },
  {
    id: 'idea-structure',
    title: 'アイデア構造論',
    description: 'アイデア体の内部構造とその相互作用について、最新の研究成果を交えて解説します。',
    category: 'basic',
    reference: 'IDE-002',
    isAvailable: true,
    variant: 'image',
    imagePath: '/images/ideas/structure.jpg',
    link: '/laboratory/ideas/structure',
    tags: ['構造解析', '理論研究']
  },
  {
    id: 'resonance-theory',
    title: '共鳴現象の研究',
    description: 'アイデア体間で発生する共鳴現象について、その特徴と観測手法を詳しく解説します。',
    category: 'advanced',
    reference: 'IDE-003',
    isAvailable: true,
    variant: 'document',
    link: '/laboratory/ideas/resonance',
    tags: ['共鳴', '相互作用']
  },
  {
    id: 'quantum-ideas',
    title: '量子アイデア理論',
    description: '量子力学的な観点からアイデア体を解析する新しい研究アプローチを紹介します。',
    category: 'advanced',
    reference: 'IDE-004',
    isAvailable: false,
    variant: 'document',
    tags: ['量子理論', '先端研究']
  },
  {
    id: 'observation-methods',
    title: '観測手法ガイド',
    description: 'アイデア体の観測に使用される様々な手法と、その特徴について解説します。',
    category: 'research',
    reference: 'IDE-005',
    isAvailable: true,
    variant: 'document',
    link: '/laboratory/ideas/observation',
    tags: ['観測手法', '実践']
  }
];

// カードのスタイルを定義
const getCardStyle = (isAvailable: boolean) => ({
  flex: '1 1 400px',
  minHeight: '300px',
  cursor: isAvailable ? 'pointer' : 'default',
  transition: 'all 0.2s ease-in-out',
  transform: 'scale(1)',
  '&:hover': isAvailable ? {
    transform: 'scale(1.02)'
  } : undefined
});

export const IdeaLibrary: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('basic');
  const { tokens } = useTheme();

  return (
    <View 
      padding={{ base: '1rem', medium: '2rem' }}
      backgroundColor={tokens.colors.background.secondary}
    >
      <View 
        backgroundColor={tokens.colors.background.primary}
        padding={{ base: '1.5rem', medium: '2rem' }}
        borderRadius="medium"
      >
        <Heading 
          level={1} 
          marginBottom="1rem"
          color={tokens.colors.font.primary}
        >
          アイデアライブラリ
        </Heading>
        
        <Text 
          marginBottom="2rem"
          color={tokens.colors.font.secondary}
        >
          研究所で蓄積された、アイデア体に関する研究成果と理論をご覧いただけます。
          各資料は研究の進展に応じて定期的に更新されます。
        </Text>

        {/* タブナビゲーション */}
        <Flex 
          gap="medium" 
          marginBottom="2rem"
          backgroundColor={tokens.colors.background.tertiary}
          padding="0.5rem"
          borderRadius="small"
        >
          {[
            { id: 'basic', label: '基礎理論' },
            { id: 'advanced', label: '発展研究' },
            { id: 'research', label: '研究手法' }
          ].map(tab => (
            <View
              key={tab.id}
              onClick={() => setActiveCategory(tab.id)}
              padding="0.75rem 1.5rem"
              backgroundColor={activeCategory === tab.id ? 
                tokens.colors.background.primary : 'transparent'}
              color={activeCategory === tab.id ? 
                tokens.colors.font.primary : tokens.colors.font.secondary}
              borderRadius="small"
              style={{ 
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out'
              }}
            >
              {tab.label}
            </View>
          ))}
        </Flex>

        {/* ドキュメントグリッド */}
        <Flex 
          gap="medium"
          wrap="wrap"
        >
          {ideaDocs
            .filter(doc => doc.category === activeCategory)
            .map(item => (
              <Card
                key={item.id}
                padding="0"
                variation="elevated"
                backgroundColor={tokens.colors.background.primary}
                style={getCardStyle(item.isAvailable)}
                onClick={() => item.isAvailable && item.link && window.location.assign(item.link)}
              >
                {item.variant === 'image' && item.imagePath ? (
                  <Image
                    src={item.imagePath}
                    alt={item.title}
                    width="100%"
                    height="160px"
                    objectFit="cover"
                  />
                ) : (
                  <View
                    height="160px"
                    backgroundColor={tokens.colors.background.tertiary}
                    padding="2rem"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Text fontSize="large" color={tokens.colors.font.secondary}>
                      {item.title}
                    </Text>
                  </View>
                )}
                
                <View padding="1.5rem">
                  <Heading 
                    level={3} 
                    color={tokens.colors.font.primary}
                  >
                    {item.title}
                  </Heading>
                  <Text 
                    marginTop="0.75rem"
                    color={tokens.colors.font.secondary}
                  >
                    {item.description}
                  </Text>
                  
                  {/* タグ表示 */}
                  <Flex 
                    gap="small" 
                    marginTop="1rem" 
                    wrap="wrap"
                  >
                    {item.tags.map(tag => (
                      <Badge
                        key={tag}
                        variation="info"
                        size="small"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </Flex>

                  <Flex 
                    justifyContent="space-between" 
                    alignItems="center" 
                    marginTop="1rem"
                  >
                    <Badge 
                      variation={item.isAvailable ? 'success' : 'warning'}
                      size="small"
                    >
                      {item.isAvailable ? '閲覧可能' : '準備中'}
                    </Badge>
                    <Text 
                      variation="tertiary"
                      fontSize="small"
                    >
                      {item.reference}
                    </Text>
                  </Flex>
                </View>
              </Card>
            ))}
        </Flex>
      </View>
    </View>
  );
};