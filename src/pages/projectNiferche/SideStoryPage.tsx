import React, { useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { UniversalCard } from '../../core/components/UniversalCard';
import ContentReader from '../../core/components/ContentReader';
import { WorldNavigation } from '../../components/navigation';
import { EXTENDED_MOCK_DATA } from '../../forclaudecode/mock_data_extended';
import { MOCK_CONTENTS } from '../../forclaudecode/mock_data';
import { WorldType } from '../../forclaudecode/mock_data';
import './SideStoryPage.css';

/**
 * ページパラメータのインターフェース
 */
interface ISideStoryParams {
  storyId?: string;
}

/**
 * フィルタータイプ
 */
type FilterType = 'all' | WorldType;

/**
 * コンテンツ型の定義
 */
interface ContentDetail {
  contentId: string;
  fullText?: string;
  chapters: any[];
  sections: any[];
  relatedContentIds: string[];
  glossaryTerms: string[];
  viewCount: number;
}

/**
 * 用語集アイテム型の定義
 */
interface GlossaryItem {
  id: string;
  term: string;
  definition: string;
  relatedTerms: string[];
  world: WorldType;
  category: string;
}

/**
 * サイドストーリーフィルターコンポーネント
 */
interface IFilterProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  storyCount: Record<FilterType, number>;
}

const StoryFilter: React.FC<IFilterProps> = ({ activeFilter, onFilterChange, storyCount }) => {
  const filters = [
    { id: 'all', label: 'すべて' },
    { id: 'hodemei', label: 'Hodemei' },
    { id: 'quxe', label: 'Quxe' },
    { id: 'alsarejia', label: 'Alsarejia' }
  ];
  
  return (
    <div className="story-filter">
      {filters.map(filter => (
        <button
          key={filter.id}
          className={`filter-button ${activeFilter === filter.id ? 'active' : ''} ${filter.id}`}
          onClick={() => onFilterChange(filter.id as FilterType)}
        >
          {filter.label}
          <span className="count">{storyCount[filter.id as FilterType] || 0}</span>
        </button>
      ))}
    </div>
  );
};

/**
 * サイドストーリー一覧コンポーネント
 */
const SideStoriesListSection: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const worldParam = queryParams.get('world') as WorldType | null;
  
  const [activeFilter, setActiveFilter] = useState<FilterType>(worldParam || 'all');
  
  // フィルタリングされたサイドストーリー取得
  const sideStories = MOCK_CONTENTS.filter(content => 
    content.attribute === 'side_story' && 
    (activeFilter === 'all' || content.world === activeFilter)
  );
  
  // 世界別のストーリー数をカウント
  const storyCount: Record<FilterType, number> = {
    all: MOCK_CONTENTS.filter(content => content.attribute === 'side_story').length,
    hodemei: MOCK_CONTENTS.filter(content => content.attribute === 'side_story' && content.world === 'hodemei').length,
    quxe: MOCK_CONTENTS.filter(content => content.attribute === 'side_story' && content.world === 'quxe').length,
    alsarejia: MOCK_CONTENTS.filter(content => content.attribute === 'side_story' && content.world === 'alsarejia').length,
    common: MOCK_CONTENTS.filter(content => content.attribute === 'side_story' && content.world === 'common').length
  };
  
  // 世界別ナビゲーションの表示
  const renderWorldNavigation = () => {
    if (activeFilter !== 'all' && activeFilter !== 'common') {
      return (
        <div className="world-navigation-container">
          <WorldNavigation worldType={activeFilter} mode="tab" />
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="side-stories-overview">
      <h1>サイドストーリー</h1>
      <p className="stories-description">
        各世界の様々な人物や出来事にフォーカスした短編物語です。
        メインストーリーを補完する豊かな世界観をお楽しみください。
      </p>
      
      <StoryFilter 
        activeFilter={activeFilter} 
        onFilterChange={setActiveFilter} 
        storyCount={storyCount} 
      />
      
      {/* 世界別ナビゲーション */}
      {renderWorldNavigation()}
      
      <div className="stories-grid">
        {sideStories.length > 0 ? (
          sideStories.map(story => (
            <Link 
              to={`/project-niferche/side-story/${story.id}`}
              key={story.id}
              className="story-card-link"
            >
              <UniversalCard
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
              />
            </Link>
          ))
        ) : (
          <div className="empty-state">
            <p>選択されたフィルターに一致するストーリーがありません。</p>
            <button 
              className="reset-button"
              onClick={() => setActiveFilter('all')}
            >
              フィルターをリセット
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * サイドストーリー詳細コンポーネント
 */
interface ISideStoryDetailProps {
  storyId: string;
}

const SideStoryDetail: React.FC<ISideStoryDetailProps> = ({ storyId }) => {
  // 選択されたストーリーに基づいてコンテンツを取得
  const contentDetail = EXTENDED_MOCK_DATA.contentDetails.find(content => 
    content.contentId === storyId
  );
  
  // 世界タイプを取得
  const story = MOCK_CONTENTS.find(content => content.id === storyId);
  const worldType = story?.world || 'common';
  
  // コンテンツが見つからない場合
  if (!contentDetail) {
    return (
      <div className="content-not-found">
        <h2>指定されたストーリーが見つかりませんでした</h2>
        <Link to="/project-niferche/side-story" className="back-link">ストーリー一覧に戻る</Link>
      </div>
    );
  }
  
  return (
    <div className={`side-story-detail ${worldType}`}>
      <div className="story-navigation">
        <Link to="/project-niferche/side-story" className="back-to-list">
          &larr; ストーリー一覧に戻る
        </Link>
        <span className="world-badge">{worldType.toUpperCase()}</span>
      </div>
      
      {/* 世界別ナビゲーション（アイコンモード） */}
      <div className="story-world-navigation">
        <WorldNavigation worldType={worldType as WorldType} mode="icon" />
      </div>
      
      <div className="story-header">
        <h1>{story?.title}</h1>
        {story?.description && <p className="story-description">{story.description}</p>}
        <div className="story-meta">
          <span className="story-author">作者: {story?.author}</span>
          <span className="story-date">
            公開日: {new Date(story?.createdAt || '').toLocaleDateString('ja-JP')}
          </span>
        </div>
      </div>
      
      <ContentReader 
        content={contentDetail} 
        glossaryTerms={EXTENDED_MOCK_DATA.glossary}
        withNavigation={false}
      />
      
      <div className="story-footer">
        <div className="tags-section">
          {story?.tags && story.tags.length > 0 && (
            <div className="story-tags">
              {story.tags.map(tag => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
          )}
        </div>
        
        <div className="related-section">
          <h3>関連ストーリー</h3>
          <div className="related-links">
            {contentDetail.relatedContentIds
              .filter(id => MOCK_CONTENTS.some(c => c.id === id && c.attribute === 'side_story'))
              .map(relatedId => {
                const relatedContent = MOCK_CONTENTS.find(c => c.id === relatedId);
                if (!relatedContent) return null;
                
                return (
                  <Link 
                    to={`/project-niferche/side-story/${relatedId}`} 
                    key={relatedId}
                    className={`related-link ${relatedContent.world}`}
                  >
                    {relatedContent.title}
                  </Link>
                );
              })}
          </div>
        </div>
        
        {/* 世界別ナビゲーション（カードモード） */}
        <div className="story-footer-navigation">
          <h3>この世界の探索を続ける</h3>
          <WorldNavigation worldType={worldType as WorldType} mode="card" />
        </div>
      </div>
    </div>
  );
};

/**
 * サイドストーリーページ
 */
const SideStoryPage: React.FC = () => {
  const params = useParams();
  const storyId = params.storyId;
  
  // 選択されたストーリーがない場合はリスト表示
  if (!storyId) {
    return <SideStoriesListSection />;
  }
  
  // ストーリー詳細表示
  return <SideStoryDetail storyId={storyId} />;
};

export default SideStoryPage;