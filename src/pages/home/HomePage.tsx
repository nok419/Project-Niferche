import React from 'react';
import { Link } from 'react-router-dom';
import { UniversalCard } from '../../core/components/UniversalCard';
import { useResponsive } from '../../core/hooks/useResponsive';
import { MOCK_ANNOUNCEMENTS, MOCK_CONTENTS, NAVIGATION_ITEMS } from '../../forclaudecode/mock_data';
import './HomePage.css';

// ヒーローセクションコンポーネント
const HeroSection: React.FC = () => (
  <section className="hero-section">
    <div className="hero-content">
      <h1>Project Niferche</h1>
      <p className="hero-description">
        「人類は高度な情報交換システムを有する情報社会に到達しました。<br />
        しかし、急速な技術の発展に対し、文化・精神の成熟は非常に緩やかなものです。<br />
        皆様の精神の充実と輝かしい個性の発現を願い、我々は灯火を掲げます。」
      </p>
    </div>
  </section>
);

// お知らせリストコンポーネント
interface IAnnouncementListProps {
  limit?: number;
}

const AnnouncementList: React.FC<IAnnouncementListProps> = ({ limit = 3 }) => {
  const announcements = MOCK_ANNOUNCEMENTS.slice(0, limit);
  
  return (
    <section className="announcement-section">
      <div className="section-header">
        <h2>最新のお知らせ</h2>
        <Link to="/announcements" className="view-all-link">すべて見る</Link>
      </div>
      <div className="announcement-list">
        {announcements.map((announcement) => (
          <div 
            key={announcement.id} 
            className={`announcement-item ${announcement.isHighlighted ? 'highlighted' : ''} ${announcement.category}`}
          >
            <h3>{announcement.title}</h3>
            <p>{announcement.content}</p>
            <div className="announcement-meta">
              <span className="announcement-date">{new Date(announcement.publishedAt).toLocaleDateString('ja-JP')}</span>
              <span className="announcement-category">{announcement.category}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

// 特集コンテンツコンポーネント
const FeaturedContent: React.FC = () => {
  const { isDesktop } = useResponsive();
  const featuredContents = MOCK_CONTENTS.filter(content => 
    content.tags?.includes('イラスト') || 
    content.attribute === 'main_story'
  ).slice(0, isDesktop ? 3 : 2);
  
  return (
    <section className="featured-section">
      <div className="section-header">
        <h2>特集コンテンツ</h2>
      </div>
      <div className="featured-content">
        {featuredContents.map(content => (
          <UniversalCard
            key={content.id}
            title={content.title}
            description={content.description}
            imageUrl={content.imageUrl || '/images/fallback.jpg'}
            tags={content.tags}
            world={content.world}
            size="medium"
            renderFooter={() => (
              <div className="universal-card__footer">
                {`${content.author} • ${new Date(content.createdAt).toLocaleDateString('ja-JP')}`}
              </div>
            )}
            onClick={() => console.log(`Clicked content: ${content.id}`)}
          />
        ))}
      </div>
    </section>
  );
};

// 世界ナビゲーションコンポーネント
const WorldsNavigation: React.FC = () => {
  const worlds = NAVIGATION_ITEMS.worlds;
  
  return (
    <section className="worlds-section">
      <div className="section-header">
        <h2>探索する世界</h2>
      </div>
      <div className="worlds-grid">
        {worlds.map(world => (
          <Link to={world.path} key={world.id} className={`world-card ${world.id}`}>
            <h3>{world.label}</h3>
          </Link>
        ))}
      </div>
    </section>
  );
};

// ホームページコンポーネント
const HomePage: React.FC = () => {
  return (
    <div className="home-page">
      <HeroSection />
      <div className="content-container">
        <AnnouncementList />
        <FeaturedContent />
        <WorldsNavigation />
      </div>
    </div>
  );
};

export default HomePage;