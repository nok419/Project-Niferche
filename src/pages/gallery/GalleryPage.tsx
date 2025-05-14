import React, { useState } from 'react';
import { MOCK_CONTENTS } from '../../forclaudecode/mock_data';
import { UniversalCard } from '../../core/components/UniversalCard';
import { useResponsive } from '../../core/hooks/useResponsive';
import './GalleryPage.css';

// フィルタータイプ
type GalleryFilter = 'all' | 'hodemei' | 'quxe' | 'alsarejia';

// フィルターコンポーネント
interface IFilterProps {
  activeFilter: GalleryFilter;
  onFilterChange: (filter: GalleryFilter) => void;
}

const GalleryFilter: React.FC<IFilterProps> = ({ activeFilter, onFilterChange }) => {
  const filters = [
    { id: 'all', label: 'すべて' },
    { id: 'hodemei', label: 'Hodemei' },
    { id: 'quxe', label: 'Quxe' },
    { id: 'alsarejia', label: 'Alsarejia' }
  ];
  
  return (
    <div className="gallery-filter">
      {filters.map(filter => (
        <button
          key={filter.id}
          className={`filter-button ${activeFilter === filter.id ? 'active' : ''} ${filter.id}`}
          onClick={() => onFilterChange(filter.id as GalleryFilter)}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};

// ギャラリーヘッダーコンポーネント
const GalleryHeader: React.FC = () => (
  <header className="gallery-header">
    <h1>ギャラリー</h1>
    <p className="gallery-description">
      Project Nifercheの世界を彩るイラスト、コンセプトアート、写真などの視覚的コンテンツをご覧いただけます。
      世界ごとのユニークな雰囲気をお楽しみください。
    </p>
  </header>
);

// ギャラリーページコンポーネント
const GalleryPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<GalleryFilter>('all');
  const { isDesktop, isTablet } = useResponsive();
  
  // イメージタイプのコンテンツのみを取得し、フィルターを適用
  const galleryItems = MOCK_CONTENTS.filter(content => 
    content.type === 'image' && (activeFilter === 'all' || content.world === activeFilter)
  );
  
  // レスポンシブなグリッドの列数を計算
  const getGridColumns = () => {
    if (isDesktop) return 3;
    if (isTablet) return 2;
    return 1;
  };
  
  return (
    <div className="gallery-page">
      <GalleryHeader />
      
      <GalleryFilter 
        activeFilter={activeFilter} 
        onFilterChange={setActiveFilter} 
      />
      
      {galleryItems.length > 0 ? (
        <div 
          className="gallery-grid" 
          style={{ gridTemplateColumns: `repeat(${getGridColumns()}, 1fr)` }}
        >
          {galleryItems.map(item => (
            <UniversalCard
              key={item.id}
              title={item.title}
              description={item.description}
              imageUrl={item.imageUrl || '/images/fallback.jpg'}
              tags={item.tags}
              world={item.world}
              size="large"
              variant="gallery"
              renderFooter={() => (
                <div className="universal-card__footer">
                  {`${item.author} • ${new Date(item.createdAt).toLocaleDateString('ja-JP')}`}
                </div>
              )}
              onClick={() => console.log(`Clicked gallery item: ${item.id}`)}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>表示できるギャラリーアイテムがありません。</p>
          <button 
            className="reset-button"
            onClick={() => setActiveFilter('all')}
          >
            フィルターをリセット
          </button>
        </div>
      )}
      
      <div className="gallery-info">
        <h2>ギャラリーについて</h2>
        <p>
          ここに表示されているすべての作品はProject Nifercheの公式イラストです。
          権利や利用に関する詳細は、<a href="/system/rights" className="info-link">権利表記</a>ページをご覧ください。
        </p>
        <p>
          Laboratoryセクションでは、皆様の創作作品も投稿いただけます。
          詳しくは<a href="/laboratory" className="info-link">Laboratory</a>をご覧ください。
        </p>
      </div>
    </div>
  );
};

export default GalleryPage;