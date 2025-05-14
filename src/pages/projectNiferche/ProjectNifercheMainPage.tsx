import React from 'react';
import { Link } from 'react-router-dom';
import { UniversalCard } from '../../core/components/UniversalCard';
import { useResponsive } from '../../core/hooks/useResponsive';
import { EXTENDED_MOCK_DATA } from '../../forclaudecode/mock_data_extended';
import { MOCK_CONTENTS } from '../../forclaudecode/mock_data';
import './ProjectNifercheMainPage.css';

// WorldセクションのWorldCardコンポーネント
interface IWorldCardProps {
  world: 'hodemei' | 'quxe' | 'alsarejia' | 'common';
  title: string;
  description: string;
  path: string;
}

const WorldCard: React.FC<IWorldCardProps> = ({ world, title, description, path }) => (
  <div className={`world-card ${world}`}>
    <h3>{title}</h3>
    <p>{description}</p>
    <Link to={path} className="world-link">詳細を見る</Link>
  </div>
);

// Worldsセクション
const WorldsSection: React.FC = () => (
  <section className="worlds-section">
    <h2>三つの世界</h2>
    <p className="section-description">
      Project Nifercheの物語は三つの異なる世界を舞台に展開します。それぞれの世界には独自の歴史、文化、科学（または魔法）体系があります。
    </p>
    
    <div className="worlds-grid">
      <WorldCard 
        world="hodemei"
        title="Hodemei（ホデメイ）"
        description="科学と理性の世界。論理的思考と技術革新が社会の基盤となっており、量子力学や次元物理学が高度に発達しています。"
        path="/project-niferche/materials/hodemei"
      />
      
      <WorldCard 
        world="quxe"
        title="Quxe（キュクス）"
        description="自然と感性の世界。豊かな自然環境と生命エネルギーが充満しており、魔法と呼ばれる自然エネルギーの操作技術が発達しています。"
        path="/project-niferche/materials/quxe"
      />
      
      <WorldCard 
        world="alsarejia"
        title="Alsarejia（アルサレジア）"
        description="次元の境界そのものを体現する世界。物理法則が流動的で、時間と空間の概念が曖昧になっている神秘的な場所です。"
        path="/project-niferche/materials/alsarejia"
      />
    </div>
  </section>
);

// ストーリーセクション
const StorySection: React.FC = () => {
  const { isDesktop } = useResponsive();
  const mainStories = MOCK_CONTENTS.filter(content => content.attribute === 'main_story');
  
  return (
    <section className="story-section">
      <div className="section-header">
        <h2>メインストーリー</h2>
        <Link to="/project-niferche/main-story" className="view-all-link">すべて見る</Link>
      </div>
      <p className="section-description">
        三つの世界の境界が薄れ始め、再び接近し始めた物語。次元を越える存在「Niferche」を探す旅と、世界の均衡を取り戻す冒険が始まります。
      </p>
      
      <div className="chapters-list">
        {EXTENDED_MOCK_DATA.chapters.filter(chapter => chapter.published).map(chapter => (
          <Link 
            to={`/project-niferche/main-story/${chapter.id}`} 
            key={chapter.id}
            className="chapter-item"
          >
            <h3>{chapter.title}</h3>
            <p>{chapter.summary}</p>
            <div className="chapter-meta">
              <span className="chapter-order">第{chapter.order}章</span>
              <span className="chapter-date">{new Date(chapter.publishedAt).toLocaleDateString('ja-JP')}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

// サイドストーリーセクション
const SideStoriesSection: React.FC = () => {
  const { isDesktop } = useResponsive();
  const sideStories = MOCK_CONTENTS.filter(content => content.attribute === 'side_story').slice(0, isDesktop ? 3 : 2);
  
  return (
    <section className="side-stories-section">
      <div className="section-header">
        <h2>サイドストーリー</h2>
        <Link to="/project-niferche/side-story" className="view-all-link">すべて見る</Link>
      </div>
      <p className="section-description">
        各世界の様々な人物や出来事にフォーカスした短編物語。メインストーリーを補完する豊かな世界観をお楽しみください。
      </p>
      
      <div className="stories-grid">
        {sideStories.map(story => (
          <UniversalCard
            key={story.id}
            title={story.title}
            description={story.description}
            imageUrl={story.imageUrl || '/images/fallback.jpg'}
            tags={story.tags}
            world={story.world}
            size="medium"
            renderFooter={() => (
              <div className="universal-card__footer">
                {`${story.author} • ${new Date(story.createdAt).toLocaleDateString('ja-JP')}`}
              </div>
            )}
            onClick={() => console.log(`Clicked story: ${story.id}`)}
          />
        ))}
      </div>
    </section>
  );
};

// 設定資料セクション
const MaterialsSection: React.FC = () => {
  const materials = MOCK_CONTENTS.filter(content => content.attribute === 'materials').slice(0, 3);
  
  return (
    <section className="materials-section">
      <div className="section-header">
        <h2>設定資料</h2>
        <Link to="/project-niferche/materials" className="view-all-link">すべて見る</Link>
      </div>
      <p className="section-description">
        各世界の歴史、文化、科学体系などの詳細資料。Project Nifercheの世界観をより深く理解するための情報が満載です。
      </p>
      
      <div className="materials-grid">
        {materials.map(material => (
          <div key={material.id} className={`material-card ${material.world}`}>
            <h3>{material.title}</h3>
            <p>{material.description}</p>
            <div className="material-meta">
              <span className="material-world">{material.world.toUpperCase()}</span>
              <Link to={`/project-niferche/materials/${material.id}`} className="material-link">詳細</Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

// 用語集プレビューセクション
const GlossaryPreviewSection: React.FC = () => {
  const glossaryItems = EXTENDED_MOCK_DATA.glossary.slice(0, 5);
  
  return (
    <section className="glossary-preview-section">
      <div className="section-header">
        <h2>用語集</h2>
        <Link to="/project-niferche/glossary" className="view-all-link">すべて見る</Link>
      </div>
      <p className="section-description">
        Project Nifercheの世界に登場する重要な概念、場所、組織などの解説。物語をより深く理解するための手助けとなります。
      </p>
      
      <div className="glossary-list">
        {glossaryItems.map(item => (
          <div key={item.id} className={`glossary-item ${item.world}`}>
            <h3>{item.term}</h3>
            <p>{item.definition}</p>
            <div className="glossary-meta">
              <span className="glossary-category">{item.category}</span>
              <span className="glossary-world">{item.world}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

// Project Nifercheメインページコンポーネント
const ProjectNifercheMainPage: React.FC = () => {
  return (
    <div className="project-niferche-main-page">
      <header className="page-header">
        <h1>Project Niferche</h1>
        <p className="page-description">
          三つの世界が交わる物語の旅へようこそ。<br />
          科学と魔法、理性と感性、現実と夢が交錯する世界で、<br />
          あなただけの冒険が始まります。
        </p>
      </header>
      
      <div className="content-container">
        <WorldsSection />
        <StorySection />
        <SideStoriesSection />
        <MaterialsSection />
        <GlossaryPreviewSection />
      </div>
    </div>
  );
};

export default ProjectNifercheMainPage;