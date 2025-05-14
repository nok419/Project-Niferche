// src/pages/laboratory/LCBPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { WorldNavigation } from '../../components/navigation/WorldNavigation';
import { ContentReader } from '../../core/components/ContentReader';
import { UniversalCard } from '../../core/components/UniversalCard';
import './LCBPage.css';

interface LCBContent {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  category: string;
  date: string;
  tags: string[];
}

/**
 * LCB (Literary Creative Base) を表示するページコンポーネント
 * 世界観構築・プロジェクトデザインなどのリソースを提供
 */
const LCBPage: React.FC = () => {
  const { section } = useParams<{ section?: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'project' | 'worldbuilding'>(
    section === 'worldbuilding' ? 'worldbuilding' : 'project'
  );

  // モックデータ: LCBコンテンツ
  const mockLCBContent: Record<string, LCBContent[]> = {
    project: [
      {
        id: 'lcb-p-001',
        title: 'LCBプロジェクト概要',
        description: 'LCB (Literary Creative Base) の目的と展望',
        thumbnailUrl: '/images/fallback.jpg',
        category: 'プロジェクト',
        date: '2024/04/01',
        tags: ['LCB', 'プロジェクト', '概要']
      },
      {
        id: 'lcb-p-002',
        title: '創作プロセスガイド',
        description: 'ストーリー、キャラクター、世界観の効果的な構築方法',
        thumbnailUrl: '/images/fallback.jpg',
        category: 'ガイド',
        date: '2024/04/05',
        tags: ['創作', 'プロセス', 'ガイド']
      },
      {
        id: 'lcb-p-003',
        title: 'コラボレーション戦略',
        description: '共同創作プロジェクトの成功のための戦略と方法',
        thumbnailUrl: '/images/fallback.jpg',
        category: '戦略',
        date: '2024/04/10',
        tags: ['コラボレーション', 'チームワーク', '創作']
      },
      {
        id: 'lcb-p-004',
        title: 'プロジェクト管理ツール',
        description: '創作プロジェクトに役立つツールとリソース',
        thumbnailUrl: '/images/fallback.jpg',
        category: 'ツール',
        date: '2024/04/15',
        tags: ['ツール', '管理', 'リソース']
      }
    ],
    worldbuilding: [
      {
        id: 'lcb-w-001',
        title: '世界観構築の基礎',
        description: '魅力的で一貫性のある世界を作るための基本原則',
        thumbnailUrl: '/images/fallback.jpg',
        category: '基礎',
        date: '2024/03/01',
        tags: ['世界観', '構築', '基礎']
      },
      {
        id: 'lcb-w-002',
        title: '地理と地形の設計',
        description: '物語の舞台となる地理環境の創造方法',
        thumbnailUrl: '/images/fallback.jpg',
        category: '地理',
        date: '2024/03/05',
        tags: ['地理', '設計', '環境']
      },
      {
        id: 'lcb-w-003',
        title: '歴史と文化の構築',
        description: '世界に深みを与える歴史と文化の創造ガイド',
        thumbnailUrl: '/images/fallback.jpg',
        category: '文化',
        date: '2024/03/10',
        tags: ['歴史', '文化', '社会']
      },
      {
        id: 'lcb-w-004',
        title: '魔法と技術のシステム',
        description: '魔法や技術の一貫性のあるシステムを設計する方法',
        thumbnailUrl: '/images/fallback.jpg',
        category: 'システム',
        date: '2024/03/15',
        tags: ['魔法', '技術', 'システム']
      },
      {
        id: 'lcb-w-005',
        title: '生態系と生物相の設計',
        description: '独自の生物と生態系を作成するガイド',
        thumbnailUrl: '/images/fallback.jpg',
        category: '生態系',
        date: '2024/03/20',
        tags: ['生態系', '生物', '設計']
      },
      {
        id: 'lcb-w-006',
        title: '言語と命名法',
        description: '架空の言語と効果的な命名の原則',
        thumbnailUrl: '/images/fallback.jpg',
        category: '言語',
        date: '2024/03/25',
        tags: ['言語', '命名', '設計']
      }
    ]
  };

  // タブ切り替え時にURLも更新
  useEffect(() => {
    if ((section === 'project' && activeTab === 'project') || 
        (section === 'worldbuilding' && activeTab === 'worldbuilding')) {
      return;
    }
    
    navigate(`/laboratory/lcb/${activeTab}`);
  }, [activeTab, navigate, section]);

  // タブが変更された時の処理
  const handleTabChange = (tab: 'project' | 'worldbuilding') => {
    setActiveTab(tab);
  };

  return (
    <div className="lcb-page">
      <header className="lcb-page__header">
        <h1 className="lcb-page__title">Literary Creative Base</h1>
        <p className="lcb-page__description">
          LCB（Literary Creative Base）は創作活動を支援するリソースセンターです。
          世界観構築、ストーリー展開、キャラクター設計など、創作に役立つリソースを提供します。
        </p>
      </header>

      <WorldNavigation worldType="laboratory" mode="tab" />

      <div className="lcb-page__tabs">
        <button 
          className={`lcb-page__tab ${activeTab === 'project' ? 'active' : ''}`}
          onClick={() => handleTabChange('project')}
          aria-selected={activeTab === 'project'}
        >
          プロジェクト概要
        </button>
        <button 
          className={`lcb-page__tab ${activeTab === 'worldbuilding' ? 'active' : ''}`}
          onClick={() => handleTabChange('worldbuilding')}
          aria-selected={activeTab === 'worldbuilding'}
        >
          世界観構築
        </button>
      </div>

      {activeTab === 'project' && (
        <section className="lcb-page__content">
          <h2 className="lcb-page__section-title">プロジェクト概要</h2>
          <p className="lcb-page__section-description">
            LCBプロジェクトの目的、ビジョン、そして創作活動を支援するためのリソースを紹介します。
            創作に関する様々なガイドラインやツールを提供しています。
          </p>

          <div className="lcb-page__grid">
            {mockLCBContent.project.map(content => (
              <UniversalCard
                key={content.id}
                title={content.title}
                description={content.description}
                imageUrl={content.thumbnailUrl}
                tags={content.tags}
                renderFooter={() => (
                  <div className="universal-card__footer">
                    {`カテゴリ: ${content.category} • ${content.date}`}
                  </div>
                )}
                variant="material"
                onClick={() => console.log(`Viewing content: ${content.id}`)}
              />
            ))}
          </div>
        </section>
      )}

      {activeTab === 'worldbuilding' && (
        <section className="lcb-page__content">
          <h2 className="lcb-page__section-title">世界観構築</h2>
          <p className="lcb-page__section-description">
            魅力的で一貫性のある世界を構築するためのリソースやガイドを提供します。
            地理、歴史、文化、魔法、技術など、様々な側面から世界観を構築する方法を学べます。
          </p>

          <div className="lcb-page__grid">
            {mockLCBContent.worldbuilding.map(content => (
              <UniversalCard
                key={content.id}
                title={content.title}
                description={content.description}
                imageUrl={content.thumbnailUrl}
                tags={content.tags}
                renderFooter={() => (
                  <div className="universal-card__footer">
                    {`カテゴリ: ${content.category} • ${content.date}`}
                  </div>
                )}
                variant="material"
                onClick={() => console.log(`Viewing content: ${content.id}`)}
              />
            ))}
          </div>
        </section>
      )}

      <footer className="lcb-page__footer">
        <div className="lcb-page__cta">
          <h3>創作活動を始めませんか？</h3>
          <p>
            自分だけの世界を作り、物語を紡ぎ、キャラクターに命を吹き込みましょう。
            LCBがあなたの創造性をサポートします。
          </p>
          <button className="lcb-page__cta-button">
            創作ワークショップに参加する
          </button>
        </div>
      </footer>
    </div>
  );
};

export default LCBPage;