// src/pages/laboratory/ParallelPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { WorldNavigation } from '../../components/navigation/WorldNavigation';
import { ContentReader } from '../../core/components/ContentReader';
import { UniversalCard } from '../../core/components/UniversalCard';
import './ParallelPage.css';

export interface ParallelStory {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  author: string;
  date: string;
  tags: string[];
  worldType: 'hodemei' | 'quxe' | 'alsarejia' | 'common';
}

export interface ParallelWorld {
  id: string;
  name: string;
  description: string;
  thumbnailUrl: string;
  creator: string;
  date: string;
  features: string[];
}

/**
 * パラレルセクションを表示するページコンポーネント
 * パラレルストーリーと、パラレルワールドの2つのセクションがある
 */
const ParallelPage: React.FC = () => {
  const { section } = useParams<{ section?: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'stories' | 'worlds'>(
    section === 'worlds' ? 'worlds' : 'stories'
  );

  // モックデータ：パラレルストーリー
  const mockParallelStories: ParallelStory[] = [
    {
      id: 'ps-001',
      title: 'Hodemeiの別の可能性',
      description: 'エネルギー危機を別の方法で解決した世界線のHodemei',
      thumbnailUrl: '/images/fallback.jpg',
      author: 'タカハシ',
      date: '2024/04/15',
      tags: ['パラレル', 'Hodemei', '科学', 'エネルギー'],
      worldType: 'hodemei'
    },
    {
      id: 'ps-002',
      title: 'Quxeの夜明け',
      description: '工業化が進んだQuxeの世界線。自然との共存は可能か？',
      thumbnailUrl: '/images/fallback.jpg',
      author: 'ミズキ',
      date: '2024/04/10',
      tags: ['パラレル', 'Quxe', '環境', '技術'],
      worldType: 'quxe'
    },
    {
      id: 'ps-003',
      title: 'Alsarejiaの終焉',
      description: '境界が閉じてしまった世界線のAlsarejia',
      thumbnailUrl: '/images/fallback.jpg',
      author: 'カナタ',
      date: '2024/04/05',
      tags: ['パラレル', 'Alsarejia', '次元', '境界'],
      worldType: 'alsarejia'
    },
    {
      id: 'ps-004',
      title: '交差する運命',
      description: '3つの世界が別の形で交わった世界線',
      thumbnailUrl: '/images/fallback.jpg',
      author: 'ユウキ',
      date: '2024/04/01',
      tags: ['パラレル', '交差', '運命', '出会い'],
      worldType: 'common'
    }
  ];

  // モックデータ：パラレルワールド
  const mockParallelWorlds: ParallelWorld[] = [
    {
      id: 'pw-001',
      name: 'ミラーHodemei',
      description: '巨大企業が科学を支配する反転したHodemei',
      thumbnailUrl: '/images/fallback.jpg',
      creator: 'サトウ',
      date: '2024/03/25',
      features: ['企業国家', '科学管理社会', '抵抗勢力', '技術格差']
    },
    {
      id: 'pw-002',
      name: 'ダークQuxe',
      description: '自然の破壊が進んだ暗黒の未来のQuxe',
      thumbnailUrl: '/images/fallback.jpg',
      creator: 'タニグチ',
      date: '2024/03/20',
      features: ['環境破壊', '資源枯渇', '生存競争', '希望の光']
    },
    {
      id: 'pw-003',
      name: 'エクスパンドAlsarejia',
      description: '次元の境界が完全に開いた拡張Alsarejia',
      thumbnailUrl: '/images/fallback.jpg',
      creator: 'アカツキ',
      date: '2024/03/15',
      features: ['次元侵食', '異世界存在', '混沌', '新秩序']
    }
  ];

  // タブ切り替え時にURLも更新
  useEffect(() => {
    if ((section === 'stories' && activeTab === 'stories') || 
        (section === 'worlds' && activeTab === 'worlds')) {
      return;
    }
    
    navigate(`/laboratory/parallel/${activeTab}`);
  }, [activeTab, navigate, section]);

  // タブが変更された時の処理
  const handleTabChange = (tab: 'stories' | 'worlds') => {
    setActiveTab(tab);
  };

  return (
    <div className="parallel-page">
      <header className="parallel-page__header">
        <h1 className="parallel-page__title">Parallel</h1>
        <p className="parallel-page__description">
          Parallel（パラレル）セクションでは、Project Nifercheの世界の別の可能性を探ります。
          公式とは異なる「もしも」の物語や世界観をお楽しみください。
        </p>
      </header>

      <WorldNavigation worldType="laboratory" mode="tab" />

      <div className="parallel-page__tabs">
        <button 
          className={`parallel-page__tab ${activeTab === 'stories' ? 'active' : ''}`}
          onClick={() => handleTabChange('stories')}
          aria-selected={activeTab === 'stories'}
        >
          パラレルストーリー
        </button>
        <button 
          className={`parallel-page__tab ${activeTab === 'worlds' ? 'active' : ''}`}
          onClick={() => handleTabChange('worlds')}
          aria-selected={activeTab === 'worlds'}
        >
          パラレルワールド
        </button>
      </div>

      {activeTab === 'stories' && (
        <section className="parallel-page__content">
          <h2 className="parallel-page__section-title">パラレルストーリー</h2>
          <p className="parallel-page__section-description">
            公式ストーリーとは異なる「もしも」の物語を探索できます。
            キャラクターやイベントの別の可能性を描いた作品を読んでみましょう。
          </p>

          <div className="parallel-page__grid">
            {mockParallelStories.map(story => (
              <UniversalCard
                key={story.id}
                title={story.title}
                description={story.description}
                imageUrl={story.thumbnailUrl}
                tags={story.tags}
                renderFooter={() => (
                  <div className="universal-card__footer">
                    {`作者: ${story.author} • ${story.date}`}
                  </div>
                )}
                variant="story"
                onClick={() => console.log(`Viewing story: ${story.id}`)}
              />
            ))}
          </div>
        </section>
      )}

      {activeTab === 'worlds' && (
        <section className="parallel-page__content">
          <h2 className="parallel-page__section-title">パラレルワールド</h2>
          <p className="parallel-page__section-description">
            公式の世界観とは異なる「もしも」の世界設定を探索できます。
            別の歴史や法則を持つ世界を体験してみましょう。
          </p>

          <div className="parallel-page__grid">
            {mockParallelWorlds.map(world => (
              <UniversalCard
                key={world.id}
                title={world.name}
                description={world.description}
                imageUrl={world.thumbnailUrl}
                tags={world.features}
                renderFooter={() => (
                  <div className="universal-card__footer">
                    {`作成者: ${world.creator} • ${world.date}`}
                  </div>
                )}
                variant="material"
                onClick={() => console.log(`Exploring world: ${world.id}`)}
              />
            ))}
          </div>
        </section>
      )}

      <footer className="parallel-page__footer">
        <p>
          <strong>注意:</strong> パラレルコンテンツは公式設定とは異なります。
          公式世界の理解には、Project Nifercheの公式コンテンツをご参照ください。
        </p>
      </footer>
    </div>
  );
};

export default ParallelPage;