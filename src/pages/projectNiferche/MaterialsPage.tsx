import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ContentReader from '../../core/components/ContentReader';
import { WorldNavigation } from '../../components/navigation';
import { EXTENDED_MOCK_DATA } from '../../forclaudecode/mock_data_extended';
import { MOCK_CONTENTS } from '../../forclaudecode/mock_data';
import { WorldType } from '../../forclaudecode/mock_data';
import './MaterialsPage.css';

/**
 * ページパラメータのインターフェース
 */
interface IMaterialsParams {
  materialId?: string;
  worldId?: string;
}

/**
 * 設定資料フィルタータイプ
 */
type MaterialsFilterType = 'all' | WorldType;

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
 * 設定資料フィルターコンポーネント
 */
interface IMaterialsFilterProps {
  activeFilter: MaterialsFilterType;
  onFilterChange: (filter: MaterialsFilterType) => void;
  materialsCount: Record<MaterialsFilterType, number>;
}

const MaterialsFilter: React.FC<IMaterialsFilterProps> = ({ 
  activeFilter, 
  onFilterChange, 
  materialsCount 
}) => {
  const filters = [
    { id: 'all', label: 'すべて' },
    { id: 'hodemei', label: 'Hodemei' },
    { id: 'quxe', label: 'Quxe' },
    { id: 'alsarejia', label: 'Alsarejia' },
    { id: 'common', label: '共通設定' }
  ];
  
  return (
    <div className="materials-filter">
      {filters.map(filter => (
        <button
          key={filter.id}
          className={`filter-button ${activeFilter === filter.id ? 'active' : ''} ${filter.id}`}
          onClick={() => onFilterChange(filter.id as MaterialsFilterType)}
        >
          {filter.label}
          <span className="count">{materialsCount[filter.id as MaterialsFilterType] || 0}</span>
        </button>
      ))}
    </div>
  );
};

/**
 * 設定資料一覧コンポーネント
 */
const MaterialsListSection: React.FC<{ worldId?: string }> = ({ worldId }) => {
  const [activeFilter, setActiveFilter] = useState<MaterialsFilterType>(worldId as MaterialsFilterType || 'all');
  
  // フィルタリングされた設定資料を取得
  const materialsList = MOCK_CONTENTS.filter(content => 
    content.attribute === 'materials' && 
    (activeFilter === 'all' || content.world === activeFilter)
  );
  
  // 世界別の設定資料数をカウント
  const materialsCount: Record<MaterialsFilterType, number> = {
    all: MOCK_CONTENTS.filter(content => content.attribute === 'materials').length,
    hodemei: MOCK_CONTENTS.filter(content => content.attribute === 'materials' && content.world === 'hodemei').length,
    quxe: MOCK_CONTENTS.filter(content => content.attribute === 'materials' && content.world === 'quxe').length,
    alsarejia: MOCK_CONTENTS.filter(content => content.attribute === 'materials' && content.world === 'alsarejia').length,
    common: MOCK_CONTENTS.filter(content => content.attribute === 'materials' && content.world === 'common').length
  };
  
  // 世界説明
  const worldDescriptions = {
    hodemei: '科学と理性の世界。論理的思考と技術革新が社会の基盤となっており、量子力学や次元物理学が高度に発達しています。',
    quxe: '自然と感性の世界。豊かな自然環境と生命エネルギーが充満しており、魔法と呼ばれる自然エネルギーの操作技術が発達しています。',
    alsarejia: '次元の境界そのものを体現する世界。物理法則が流動的で、時間と空間の概念が曖昧になっている神秘的な場所です。',
    common: 'Project Nifercheの世界観についての基本的な設定や、三つの世界に共通する概念、法則などを解説しています。'
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
    <div className="materials-overview">
      <h1>設定資料</h1>
      <p className="materials-description">
        Project Nifercheの世界設定や背景についての詳細資料です。
        各世界の歴史や文化、科学体系などを探索して、ストーリーをより深く理解しましょう。
      </p>
      
      <MaterialsFilter 
        activeFilter={activeFilter} 
        onFilterChange={setActiveFilter} 
        materialsCount={materialsCount} 
      />
      
      {/* 選択された世界の説明 */}
      {activeFilter !== 'all' && (
        <div className={`world-explanation ${activeFilter}`}>
          <h2>{activeFilter === 'common' ? '共通設定' : activeFilter.toUpperCase()}</h2>
          <p>{worldDescriptions[activeFilter as keyof typeof worldDescriptions]}</p>
        </div>
      )}
      
      {/* 世界別ナビゲーション */}
      {renderWorldNavigation()}
      
      <div className="materials-grid">
        {materialsList.length > 0 ? (
          materialsList.map(material => (
            <Link 
              to={`/project-niferche/materials/${material.id}`}
              key={material.id}
              className={`material-card ${material.world}`}
            >
              <h3>{material.title}</h3>
              <p>{material.description}</p>
              <div className="material-meta">
                <span className="material-world">{material.world.toUpperCase()}</span>
              </div>
            </Link>
          ))
        ) : (
          <div className="empty-state">
            <p>選択されたフィルターに一致する設定資料がありません。</p>
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
 * 設定資料詳細コンポーネント
 */
interface IMaterialDetailProps {
  materialId: string;
}

const MaterialDetail: React.FC<IMaterialDetailProps> = ({ materialId }) => {
  // 選択された設定資料に基づいてコンテンツを取得
  const contentDetail = EXTENDED_MOCK_DATA.contentDetails.find(content => 
    content.contentId === materialId
  );
  
  // 世界タイプを取得
  const material = MOCK_CONTENTS.find(content => content.id === materialId);
  const worldType = material?.world || 'common';
  
  // コンテンツが見つからない場合
  if (!contentDetail) {
    return (
      <div className="content-not-found">
        <h2>指定された設定資料が見つかりませんでした</h2>
        <Link to="/project-niferche/materials" className="back-link">設定資料一覧に戻る</Link>
      </div>
    );
  }
  
  return (
    <div className={`material-detail ${worldType}`}>
      <div className="material-navigation">
        <Link to="/project-niferche/materials" className="back-to-list">
          &larr; 設定資料一覧に戻る
        </Link>
        <span className="world-badge">{worldType.toUpperCase()}</span>
      </div>
      
      {/* 世界別ナビゲーション（アイコンモード） */}
      <div className="material-world-navigation">
        <WorldNavigation worldType={worldType as WorldType} mode="icon" />
      </div>
      
      <div className="material-header">
        <h1>{material?.title}</h1>
        {material?.description && <p className="material-description">{material.description}</p>}
      </div>
      
      <ContentReader 
        content={contentDetail} 
        glossaryTerms={EXTENDED_MOCK_DATA.glossary}
        withNavigation={false}
      />
      
      <div className="material-footer">
        <div className="related-section">
          <h3>関連資料</h3>
          <div className="related-links">
            {contentDetail.relatedContentIds
              .filter(id => MOCK_CONTENTS.some(c => c.id === id && c.attribute === 'materials'))
              .map(relatedId => {
                const relatedContent = MOCK_CONTENTS.find(c => c.id === relatedId);
                if (!relatedContent) return null;
                
                return (
                  <Link 
                    to={`/project-niferche/materials/${relatedId}`} 
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
        <div className="material-footer-navigation">
          <h3>この世界の探索を続ける</h3>
          <WorldNavigation worldType={worldType as WorldType} mode="card" />
        </div>
      </div>
    </div>
  );
};

/**
 * 設定資料ページ
 */
const MaterialsPage: React.FC = () => {
  const params = useParams();
  const materialId = params.materialId;
  const worldId = params.worldId;
  
  // 選択された設定資料がない場合はリスト表示
  if (!materialId) {
    return <MaterialsListSection worldId={worldId} />;
  }
  
  // 設定資料詳細表示
  return <MaterialDetail materialId={materialId} />;
};

export default MaterialsPage;