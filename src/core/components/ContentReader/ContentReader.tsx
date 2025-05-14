import React, { useState } from 'react';
import { ContentDetail, Section, Chapter, GlossaryItem } from '../../../forclaudecode/mock_data_extended';
import './ContentReader.css';

/**
 * 用語フラッシュカードコンポーネント
 */
interface IGlossaryCardProps {
  term: GlossaryItem;
  onClose: () => void;
}

const GlossaryCard: React.FC<IGlossaryCardProps> = ({ term, onClose }) => (
  <div className={`glossary-card ${term.world}`}>
    <div className="glossary-card-header">
      <h3>{term.term}</h3>
      <button className="close-button" onClick={onClose}>×</button>
    </div>
    <div className="glossary-card-content">
      <p>{term.definition}</p>
      {term.relatedTerms.length > 0 && (
        <div className="related-terms">
          <span>関連用語: </span>
          {term.relatedTerms.join(', ')}
        </div>
      )}
    </div>
    <div className="glossary-card-footer">
      <span className="glossary-category">{term.category}</span>
      <span className="glossary-world">{term.world}</span>
    </div>
  </div>
);

/**
 * コンテンツリーダーのプロップス
 */
export interface IContentReaderProps {
  content: ContentDetail;
  glossaryTerms?: GlossaryItem[];
  currentChapterId?: string;
  withNavigation?: boolean;
  onChapterChange?: (chapterId: string) => void;
}

/**
 * コンテンツリーダーコンポーネント
 * メインストーリーやサイドストーリー、設定資料などのテキストコンテンツを表示するためのリーダーコンポーネント
 */
export const ContentReader: React.FC<IContentReaderProps> = ({
  content,
  glossaryTerms = [],
  currentChapterId,
  withNavigation = true,
  onChapterChange
}) => {
  // 章の状態管理
  const [activeChapterId, setActiveChapterId] = useState<string>(
    currentChapterId || (content.chapters.length > 0 ? content.chapters[0].id : '')
  );
  
  // 用語集の状態管理
  const [activeTerm, setActiveTerm] = useState<GlossaryItem | null>(null);
  
  // 現在の章に関連するセクションを取得
  const currentSections = activeChapterId
    ? content.sections.filter(section => section.chapterId === activeChapterId)
    : [];
  
  // 現在の章情報を取得
  const currentChapter = content.chapters.find(chapter => chapter.id === activeChapterId);
  
  // 章の変更ハンドラ
  const handleChapterChange = (chapterId: string) => {
    setActiveChapterId(chapterId);
    if (onChapterChange) {
      onChapterChange(chapterId);
    }
  };
  
  // 純粋なテキスト表示ではなく、fullTextを利用する場合
  if (content.fullText && !content.chapters.length) {
    return (
      <div className="content-reader full-text">
        <div className="content-container" dangerouslySetInnerHTML={{ __html: content.fullText }} />
        
        {/* 用語カード */}
        {activeTerm && (
          <GlossaryCard 
            term={activeTerm} 
            onClose={() => setActiveTerm(null)} 
          />
        )}
      </div>
    );
  }
  
  return (
    <div className="content-reader">
      {/* 章ナビゲーション */}
      {withNavigation && content.chapters.length > 1 && (
        <div className="chapter-navigation">
          {content.chapters.map(chapter => (
            <button
              key={chapter.id}
              className={`chapter-button ${activeChapterId === chapter.id ? 'active' : ''} ${!chapter.published ? 'disabled' : ''}`}
              onClick={() => handleChapterChange(chapter.id)}
              disabled={!chapter.published}
            >
              <span className="chapter-number">{chapter.order}</span>
              <span className="chapter-title">{chapter.title}</span>
            </button>
          ))}
        </div>
      )}
      
      {/* 章タイトル */}
      {currentChapter && (
        <header className="chapter-header">
          <h1>{currentChapter.title}</h1>
          {currentChapter.summary && <p className="chapter-summary">{currentChapter.summary}</p>}
        </header>
      )}
      
      {/* セクションのコンテンツ */}
      <div className="content-container">
        {currentSections.map(section => (
          <div 
            key={section.id}
            id={section.id}
            className={`content-section ${section.worldType}`}
          >
            {section.title && <h2 className="section-title">{section.title}</h2>}
            <div 
              className="section-content"
              dangerouslySetInnerHTML={{ __html: section.content }} 
            />
          </div>
        ))}
      </div>
      
      {/* ナビゲーションボタン */}
      {withNavigation && (
        <div className="content-navigation">
          <div className="navigation-buttons">
            {currentChapter && currentChapter.order > 1 && (
              <button 
                className="nav-button prev"
                onClick={() => {
                  const prevChapter = content.chapters.find(c => c.order === currentChapter.order - 1);
                  if (prevChapter) handleChapterChange(prevChapter.id);
                }}
              >
                前の章
              </button>
            )}
            
            {currentChapter && content.chapters.some(c => c.order === currentChapter.order + 1) && (
              <button 
                className="nav-button next"
                onClick={() => {
                  const nextChapter = content.chapters.find(c => c.order === currentChapter.order + 1);
                  if (nextChapter && nextChapter.published) handleChapterChange(nextChapter.id);
                }}
              >
                次の章
              </button>
            )}
          </div>
        </div>
      )}
      
      {/* 用語カード */}
      {activeTerm && (
        <GlossaryCard 
          term={activeTerm} 
          onClose={() => setActiveTerm(null)} 
        />
      )}
    </div>
  );
};

export default ContentReader;