import React, { useState } from 'react';
import { MOCK_ANNOUNCEMENTS } from '../../forclaudecode/mock_data';
import './AnnouncementsPage.css';

// お知らせカテゴリータイプ
type AnnouncementCategory = 'all' | 'update' | 'event' | 'important' | 'general';

// カテゴリーフィルターコンポーネント
interface ICategoryFilterProps {
  selectedCategory: AnnouncementCategory;
  onCategoryChange: (category: AnnouncementCategory) => void;
}

const CategoryFilter: React.FC<ICategoryFilterProps> = ({ selectedCategory, onCategoryChange }) => {
  const categories: Array<{ id: AnnouncementCategory; label: string }> = [
    { id: 'all', label: 'すべて' },
    { id: 'update', label: '更新情報' },
    { id: 'event', label: 'イベント' },
    { id: 'important', label: '重要なお知らせ' },
    { id: 'general', label: '一般' },
  ];
  
  return (
    <div className="category-filter">
      {categories.map(category => (
        <button
          key={category.id}
          className={`category-button ${selectedCategory === category.id ? 'active' : ''}`}
          onClick={() => onCategoryChange(category.id)}
        >
          {category.label}
        </button>
      ))}
    </div>
  );
};

// お知らせページコンポーネント
const AnnouncementsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<AnnouncementCategory>('all');
  
  // フィルタリングされたお知らせを取得
  const filteredAnnouncements = MOCK_ANNOUNCEMENTS.filter(announcement => 
    selectedCategory === 'all' || announcement.category === selectedCategory
  );
  
  return (
    <div className="announcements-page">
      <header className="page-header">
        <h1>お知らせ</h1>
        <p className="page-description">
          Project Nifercheからの最新情報、更新内容、イベントなどのお知らせをご覧いただけます。
        </p>
      </header>
      
      <CategoryFilter 
        selectedCategory={selectedCategory} 
        onCategoryChange={setSelectedCategory} 
      />
      
      <div className="announcements-list">
        {filteredAnnouncements.length > 0 ? (
          filteredAnnouncements.map(announcement => (
            <div 
              key={announcement.id} 
              className={`announcement-item ${announcement.isHighlighted ? 'highlighted' : ''} ${announcement.category}`}
            >
              <h2>{announcement.title}</h2>
              <p className="announcement-content">{announcement.content}</p>
              <div className="announcement-meta">
                <span className="announcement-date">
                  {new Date(announcement.publishedAt).toLocaleDateString('ja-JP', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
                <span className="announcement-category-badge">{announcement.category}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <p>選択されたカテゴリーのお知らせはありません。</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnnouncementsPage;