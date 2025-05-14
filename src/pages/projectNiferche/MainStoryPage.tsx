import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ContentReader from '../../core/components/ContentReader';
import { EXTENDED_MOCK_DATA } from '../../forclaudecode/mock_data_extended';
import './MainStoryPage.css';

/**
 * ページパラメータのインターフェース
 */
interface IMainStoryParams {
  chapterId?: string;
}

/**
 * メインストーリー一覧セクション（章選択）
 */
const ChaptersListSection: React.FC = () => {
  const chapters = EXTENDED_MOCK_DATA.chapters;
  
  return (
    <div className="chapters-overview">
      <h1>メインストーリー</h1>
      <p className="chapters-description">
        Project Nifercheの核となる物語です。三つの世界の境界が薄れ始め、再び接近し始めた時の出来事を描きます。
        次元を超える存在「Niferche」を探す旅と世界の均衡を取り戻す冒険の物語をお楽しみください。
      </p>
      
      <div className="chapters-grid">
        {chapters.map(chapter => (
          <Link 
            to={`/project-niferche/main-story/${chapter.id}`}
            key={chapter.id}
            className={`chapter-card ${!chapter.published ? 'disabled' : ''}`}
          >
            <span className="chapter-number">第{chapter.order}章</span>
            <h2>{chapter.title}</h2>
            <p>{chapter.summary}</p>
            <div className="chapter-meta">
              <span className="published-date">{new Date(chapter.publishedAt).toLocaleDateString('ja-JP')}</span>
              {!chapter.published && <span className="coming-soon">近日公開</span>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

/**
 * メインストーリーページ
 */
const MainStoryPage: React.FC = () => {
  const { chapterId } = useParams<IMainStoryParams>();
  const [currentChapterId, setCurrentChapterId] = useState<string | undefined>(chapterId);
  
  useEffect(() => {
    setCurrentChapterId(chapterId);
  }, [chapterId]);
  
  // 選択された章がない場合は章一覧を表示
  if (!currentChapterId) {
    return <ChaptersListSection />;
  }
  
  // 選択された章に基づいてコンテンツを取得
  const contentDetail = EXTENDED_MOCK_DATA.contentDetails.find(content => 
    content.chapters.some(chapter => chapter.id === currentChapterId)
  );
  
  // コンテンツが見つからない場合
  if (!contentDetail) {
    return (
      <div className="content-not-found">
        <h2>指定された章が見つかりませんでした</h2>
        <Link to="/project-niferche/main-story" className="back-link">ストーリー一覧に戻る</Link>
      </div>
    );
  }
  
  return (
    <div className="main-story-page">
      <div className="story-navigation">
        <Link to="/project-niferche/main-story" className="back-to-list">
          &larr; ストーリー一覧に戻る
        </Link>
      </div>
      
      <ContentReader 
        content={contentDetail} 
        currentChapterId={currentChapterId}
        glossaryTerms={EXTENDED_MOCK_DATA.glossary}
      />
      
      <div className="story-footer">
        <div className="story-meta">
          <div className="related-contents">
            <h3>関連コンテンツ</h3>
            <div className="related-links">
              {contentDetail.relatedContentIds.map(relatedId => {
                const relatedContent = EXTENDED_MOCK_DATA.contentDetails.find(
                  content => content.contentId === relatedId
                );
                if (!relatedContent) return null;
                
                // 関連コンテンツのタイプを判断して適切なリンクを生成
                const baseContent = [...EXTENDED_MOCK_DATA.contentDetails].find(
                  c => c.contentId === relatedId
                );
                if (!baseContent) return null;
                
                let linkPath = '';
                let linkText = '';
                
                if (relatedId.includes('main-story')) {
                  linkPath = `/project-niferche/main-story/${baseContent.chapters[0]?.id || ''}`;
                  linkText = 'メインストーリー';
                } else if (relatedId.includes('side-story')) {
                  linkPath = `/project-niferche/side-story/${relatedId}`;
                  linkText = 'サイドストーリー';
                } else if (relatedId.includes('materials')) {
                  linkPath = `/project-niferche/materials/${relatedId}`;
                  linkText = '設定資料';
                }
                
                return (
                  <Link to={linkPath} key={relatedId} className="related-link">
                    {linkText}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainStoryPage;