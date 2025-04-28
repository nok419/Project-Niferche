// src/pages/user/ContentDetailPage.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { generateClient } from 'aws-amplify/api';
import { StorageService } from '../../services/storage';
import { getContentType } from '../../utils/storage';
import { Schema } from '../../../amplify/data/resource';

const client = generateClient<Schema>();

// コンテンツタイプに基づいて適切なビューを返す
const ContentViewer = ({ contentKey, contentType }: { contentKey: string, contentType: string }) => {
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchUrl = async () => {
      try {
        // ファイルのURLを取得
        const accessLevel = contentKey.includes('/public/') 
          ? 'public' 
          : contentKey.includes('/authenticated/') 
            ? 'protected' 
            : 'private';
        
        const fileUrl = await StorageService.getFileUrl(contentKey, accessLevel);
        setUrl(fileUrl);
      } catch (err) {
        console.error('ファイルURLの取得エラー:', err);
        setError('ファイルを読み込めませんでした。');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUrl();
  }, [contentKey]);
  
  if (isLoading) {
    return <div>読み込み中...</div>;
  }
  
  if (error) {
    return <div className="error-message">{error}</div>;
  }
  
  if (!url) {
    return <div>コンテンツが見つかりません</div>;
  }
  
  // コンテンツタイプに基づいてビューを出し分け
  if (contentType.startsWith('image/')) {
    return <img src={url} alt="コンテンツ" className="content-image" />;
  } else if (contentType.startsWith('video/')) {
    return (
      <video controls className="content-video">
        <source src={url} type={contentType} />
        お使いのブラウザはビデオタグをサポートしていません。
      </video>
    );
  } else if (contentType.startsWith('audio/')) {
    return (
      <audio controls className="content-audio">
        <source src={url} type={contentType} />
        お使いのブラウザはオーディオタグをサポートしていません。
      </audio>
    );
  } else if (contentType === 'application/pdf') {
    return (
      <iframe 
        src={url} 
        className="pdf-viewer" 
        title="PDFビューア"
      />
    );
  } else if (contentType === 'text/markdown' || contentType === 'text/plain') {
    // テキストコンテンツの場合は別途取得して表示
    const [content, setContent] = useState<string>('');
    
    useEffect(() => {
      const fetchContent = async () => {
        try {
          const response = await fetch(url);
          const text = await response.text();
          setContent(text);
        } catch (err) {
          console.error('テキスト取得エラー:', err);
          setContent('テキストの読み込みに失敗しました。');
        }
      };
      
      fetchContent();
    }, [url]);
    
    return (
      <div className="text-content">
        <pre>{content}</pre>
      </div>
    );
  }
  
  // その他のファイルタイプ
  return (
    <div className="file-download">
      <p>このファイルは直接表示できません。</p>
      <a href={url} download target="_blank" rel="noopener noreferrer">
        ダウンロード
      </a>
    </div>
  );
};

const ContentDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [content, setContent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchContent = async () => {
      if (!id) {
        setError('コンテンツIDが指定されていません。');
        setIsLoading(false);
        return;
      }
      
      try {
        const contentData = await client.models.Content.get({ id });
        
        if (!contentData) {
          setError('コンテンツが見つかりません。');
        } else {
          setContent(contentData);
        }
      } catch (err) {
        console.error('コンテンツ取得エラー:', err);
        setError('コンテンツの読み込みに失敗しました。');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchContent();
  }, [id]);
  
  const handleDelete = async () => {
    if (!content) return;
    
    const confirmed = window.confirm('このコンテンツを削除してもよろしいですか？この操作は元に戻せません。');
    if (!confirmed) return;
    
    setIsLoading(true);
    
    try {
      // コンテンツの削除
      await client.models.Content.delete({ id: content.id });
      
      // ストレージからファイルを削除
      const accessLevel = content.mainKey.includes('/public/') 
        ? 'public' 
        : content.mainKey.includes('/authenticated/') 
          ? 'protected' 
          : 'private';
      
      await StorageService.deleteFile(content.mainKey, accessLevel);
      
      // 添付ファイルの削除
      if (content.attachments && content.attachments.length > 0) {
        await Promise.all(
          content.attachments.map((key: string) => 
            StorageService.deleteFile(
              key, 
              key.includes('/public/') 
                ? 'public' 
                : key.includes('/authenticated/') 
                  ? 'protected' 
                  : 'private'
            )
          )
        );
      }
      
      // ユーザーコンテンツ一覧に戻る
      navigate('/user/contents');
    } catch (err) {
      console.error('コンテンツ削除エラー:', err);
      setError('コンテンツの削除に失敗しました。');
      setIsLoading(false);
    }
  };
  
  const handleEdit = () => {
    navigate(`/user/contents/edit/${content.id}`);
  };
  
  if (isLoading) {
    return <div className="loading">読み込み中...</div>;
  }
  
  if (error) {
    return (
      <div className="error-container">
        <h1>エラー</h1>
        <p>{error}</p>
        <button onClick={() => navigate('/user/contents')}>
          コンテンツ一覧に戻る
        </button>
      </div>
    );
  }
  
  if (!content) {
    return (
      <div className="not-found">
        <h1>コンテンツが見つかりません</h1>
        <button onClick={() => navigate('/user/contents')}>
          コンテンツ一覧に戻る
        </button>
      </div>
    );
  }
  
  // ファイル名からコンテンツタイプを推測
  const mainFileKey = content.mainKey.split('/').pop() || '';
  const contentType = getContentType(mainFileKey);
  
  return (
    <div className="content-detail-page">
      <div className="content-header">
        <h1>{content.title}</h1>
        <div className="content-meta">
          <span>作成日: {new Date(content.createdAt).toLocaleDateString()}</span>
          <span>更新日: {new Date(content.updatedAt).toLocaleDateString()}</span>
          <span>公開状態: {
            content.visibility === 'PUBLIC' ? '公開' :
            content.visibility === 'AUTHENTICATED' ? '認証済みユーザーのみ' :
            '非公開'
          }</span>
        </div>
        
        <div className="content-actions">
          <button onClick={handleEdit}>編集</button>
          <button onClick={handleDelete} className="delete-button">削除</button>
        </div>
      </div>
      
      <div className="content-description">
        <h2>説明</h2>
        <p>{content.description}</p>
      </div>
      
      {content.tags && content.tags.length > 0 && (
        <div className="content-tags">
          <h2>タグ</h2>
          <div className="tag-list">
            {content.tags.map((tag: string, index: number) => (
              <span key={index} className="tag">{tag}</span>
            ))}
          </div>
        </div>
      )}
      
      <div className="content-preview">
        <h2>コンテンツ</h2>
        <ContentViewer contentKey={content.mainKey} contentType={contentType} />
      </div>
      
      {content.attachments && content.attachments.length > 0 && (
        <div className="content-attachments">
          <h2>添付ファイル</h2>
          <ul className="attachment-list">
            {content.attachments.map((key: string, index: number) => {
              const fileName = key.split('/').pop() || '';
              const fileType = getContentType(fileName);
              
              return (
                <li key={index} className="attachment-item">
                  <span className="attachment-name">{fileName}</span>
                  <ContentViewer contentKey={key} contentType={fileType} />
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ContentDetailPage;