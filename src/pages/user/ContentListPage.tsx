// src/pages/user/ContentListPage.tsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { generateClient } from 'aws-amplify/api';
import { getCurrentUser } from 'aws-amplify/auth';
import { Schema } from '../../../amplify/data/resource';

const client = generateClient<Schema>();

// コンテンツカテゴリーの日本語表記
const CATEGORY_LABELS: Record<string, string> = {
  'MAIN_STORY': 'メインストーリー',
  'SIDE_STORY': 'サイドストーリー',
  'SETTING_MATERIAL': '設定資料',
  'CHARACTER': 'キャラクター',
  'ORGANIZATION': '組織',
  'THEORY': '理論',
  'MERCHANDISE': '商品',
  'SITE_INFO': 'サイト情報'
};

// 世界カテゴリーの日本語表記
const WORLD_LABELS: Record<string, string> = {
  'COMMON': '共通',
  'QUXE': 'クシェ',
  'HODEMEI': 'ホデメイ',
  'ALSAREJIA': 'アルサレジア'
};

// 公開範囲の日本語表記
const VISIBILITY_LABELS: Record<string, string> = {
  'PUBLIC': '公開',
  'AUTHENTICATED': '認証済みユーザーのみ',
  'PRIVATE': '非公開'
};

// ステータスの日本語表記
const STATUS_LABELS: Record<string, string> = {
  'DRAFT': '下書き',
  'REVIEW': 'レビュー中',
  'PUBLISHED': '公開中',
  'ARCHIVED': 'アーカイブ'
};

const ContentListPage = () => {
  const navigate = useNavigate();
  const [contents, setContents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [filter, setFilter] = useState({
    category: 'all',
    visibility: 'all',
    status: 'all'
  });
  
  // ユーザーIDを取得
  useEffect(() => {
    const getUserId = async () => {
      try {
        const user = await getCurrentUser();
        setUserId(user.userId);
      } catch (err) {
        console.error('ユーザー情報の取得に失敗しました:', err);
        setError('認証情報の取得に失敗しました。再度ログインしてください。');
      }
    };
    getUserId();
  }, []);
  
  // コンテンツ一覧を取得
  useEffect(() => {
    const fetchContents = async () => {
      if (!userId) return;
      
      setIsLoading(true);
      
      try {
        const result = await client.models.Content.list({
          filter: {
            ownerId: {
              eq: userId
            }
          }
        });
        
        setContents(result.data);
      } catch (err) {
        console.error('コンテンツの取得に失敗しました:', err);
        setError('コンテンツの読み込みに失敗しました。');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchContents();
  }, [userId]);
  
  // フィルター適用
  const filteredContents = contents.filter(content => {
    if (filter.category !== 'all' && content.primaryCategory !== filter.category) {
      return false;
    }
    
    if (filter.visibility !== 'all' && content.visibility !== filter.visibility) {
      return false;
    }
    
    if (filter.status !== 'all' && content.status !== filter.status) {
      return false;
    }
    
    return true;
  });
  
  // フィルター変更ハンドラー
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilter(prev => ({ ...prev, [name]: value }));
  };
  
  // 新規コンテンツ作成ページへ遷移
  const handleCreateNew = () => {
    navigate('/user/contents/upload');
  };
  
  if (isLoading && !contents.length) {
    return <div className="loading">読み込み中...</div>;
  }
  
  if (error) {
    return (
      <div className="error-container">
        <h1>エラー</h1>
        <p>{error}</p>
      </div>
    );
  }
  
  return (
    <div className="content-list-page">
      <div className="page-header">
        <h1>マイコンテンツ</h1>
        <button onClick={handleCreateNew} className="create-button">
          新規コンテンツを作成
        </button>
      </div>
      
      <div className="filter-controls">
        <div className="filter-group">
          <label htmlFor="category">カテゴリー:</label>
          <select
            id="category"
            name="category"
            value={filter.category}
            onChange={handleFilterChange}
          >
            <option value="all">すべて</option>
            {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <label htmlFor="visibility">公開範囲:</label>
          <select
            id="visibility"
            name="visibility"
            value={filter.visibility}
            onChange={handleFilterChange}
          >
            <option value="all">すべて</option>
            {Object.entries(VISIBILITY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <label htmlFor="status">ステータス:</label>
          <select
            id="status"
            name="status"
            value={filter.status}
            onChange={handleFilterChange}
          >
            <option value="all">すべて</option>
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
      </div>
      
      {filteredContents.length === 0 ? (
        <div className="empty-state">
          <p>コンテンツがありません。新しいコンテンツを作成してみましょう。</p>
        </div>
      ) : (
        <div className="content-list">
          {filteredContents.map(content => (
            <div key={content.id} className="content-card">
              <div className="content-card-header">
                <h2 className="content-title">
                  <Link to={`/user/contents/${content.id}`}>
                    {content.title}
                  </Link>
                </h2>
                <div className="content-meta">
                  <span className="content-category">
                    {CATEGORY_LABELS[content.primaryCategory] || content.primaryCategory}
                  </span>
                  <span className="content-world">
                    {WORLD_LABELS[content.worldType] || content.worldType}
                  </span>
                  <span className={`content-visibility visibility-${content.visibility.toLowerCase()}`}>
                    {VISIBILITY_LABELS[content.visibility] || content.visibility}
                  </span>
                  <span className={`content-status status-${content.status.toLowerCase()}`}>
                    {STATUS_LABELS[content.status] || content.status}
                  </span>
                </div>
              </div>
              
              <div className="content-description">
                <p>{content.description}</p>
              </div>
              
              {content.tags && content.tags.length > 0 && (
                <div className="content-tags">
                  {content.tags.map((tag: string, index: number) => (
                    <span key={index} className="tag">{tag}</span>
                  ))}
                </div>
              )}
              
              <div className="content-dates">
                <span className="created-at">
                  作成: {new Date(content.createdAt).toLocaleDateString()}
                </span>
                <span className="updated-at">
                  更新: {new Date(content.updatedAt).toLocaleDateString()}
                </span>
              </div>
              
              <div className="content-actions">
                <Link to={`/user/contents/${content.id}`} className="view-button">
                  表示
                </Link>
                <Link to={`/user/contents/edit/${content.id}`} className="edit-button">
                  編集
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContentListPage;