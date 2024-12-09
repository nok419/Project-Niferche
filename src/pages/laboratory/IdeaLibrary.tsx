// src/pages/laboratory/IdeaLibrary.tsx
import React, { useState, useEffect, FormEvent } from 'react';
import { Collection, View, Tabs, Card, Text, Heading, Flex, Badge } from '@aws-amplify/ui-react';
import { MockStorageService } from '../../services/mockStorage';
import type { LabDocument } from '../../types/laboratory';

const ideaDocs: LabDocument[] = [
  {
    id: 'idea-basic',
    title: 'アイデア体の基本概念',
    description: '存在としてのアイデア体の定義と性質について解説します。',
    category: 'IDEA',
    reference: 'IDE-001',
    isAvailable: true,
    variant: 'document',
    hasDetail: true
  },
  {
    id: 'idea-observation',
    title: 'アイデア体観測記録',
    description: '研究施設での観測データと分析結果',
    category: 'OBSERVATION',
    reference: 'IDE-002',
    isAvailable: true,
    variant: 'document',
    hasDetail: true
  },
  {
    id: 'idea-research',
    title: '研究レポート',
    description: 'アイデア体に関する研究成果と考察',
    category: 'RESEARCH',
    reference: 'IDE-003',
    isAvailable: false,
    variant: 'document',
    hasDetail: false
  },
  {
    id: 'idea-interaction',
    title: '相互作用研究',
    description: 'アイデア体と現実世界の相互作用に関する調査',
    category: 'RESEARCH',
    reference: 'IDE-004',
    isAvailable: true,
    variant: 'document',
    hasDetail: true
  },
  {
    id: 'idea-observation-recent',
    title: '最新観測データ',
    description: '直近1ヶ月の観測記録と分析',
    category: 'OBSERVATION',
    reference: 'IDE-005',
    isAvailable: true,
    variant: 'document',
    hasDetail: true
  }
];

interface TabInfo {
  id: string;
  label: string;
  value: string;
  category: string;
}

const tabs: TabInfo[] = [
  { id: 'basic', label: '基本概念', category: 'IDEA', value: 'basic' },
  { id: 'observation', label: '観測記録', category: 'OBSERVATION', value: 'observation' },
  { id: 'research', label: '研究資料', category: 'RESEARCH', value: 'research' }
];

export const IdeaLibrary: React.FC = () => {
    const [activeTab, setActiveTab] = useState<string>('basic');
    const [content, setContent] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
  
    const handleTabChange = (event: FormEvent<HTMLDivElement>) => {
      const target = event.target as HTMLButtonElement;
      if (target.value) {
        setActiveTab(target.value);
      }
    };
  
    useEffect(() => {
      const loadContent = async () => {
        setLoading(true);
        try {
          if (activeTab === 'basic') {
            const text = await MockStorageService.getText('laboratory/ideas/basic-concept.md');
            setContent(text);
          } else {
            setContent(null);
          }
        } catch (error) {
          console.error('Error loading content:', error);
          setContent(null);
        } finally {
          setLoading(false);
        }
      };
  
      loadContent();
    }, [activeTab]);
  
    // フィルタリングロジックを関数として分離
    const getFilteredDocs = (): LabDocument[] => {
      const currentTab = tabs.find(tab => tab.value === activeTab);
      if (!currentTab) return [];
      return ideaDocs.filter(doc => doc.category === currentTab.category);
    };
  
    // JSXを返す
    return (
        <View padding="medium">
          <Flex direction="column" gap="medium">
            <Heading level={1}>アイデア体資料室</Heading>
            <Text>
              アイデア体に関する研究記録と観測データを公開しています。
              各資料は継続的に更新され、新しい発見が追加されていきます。
            </Text>
  
            <Tabs
              value={activeTab}
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
                  items={getFilteredDocs()}
                  gap="medium"
                  templateColumns={{
                    base: "1fr",
                    medium: "1fr 1fr",
                    large: "1fr 1fr 1fr"
                  }}
                >
                  {(item: LabDocument) => (
                    <Card
                      key={item.id}
                      padding="medium"
                      variation="elevated"
                      backgroundColor={item.isAvailable ? 'white' : '#f5f5f5'}
                    >
                      <Flex direction="column" gap="small">
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
  
                        <Heading level={3}>{item.title}</Heading>
                        <Text>{item.description}</Text>
                        
                        {loading && item.id === 'idea-basic' && (
                          <Text variation="tertiary">Loading...</Text>
                        )}
                        {content && item.id === 'idea-basic' && (
                          <Text fontSize="small">{content}</Text>
                        )}
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