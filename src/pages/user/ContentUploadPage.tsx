// src/pages/user/ContentUploadPage.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';
import { generateClient } from 'aws-amplify/api';
import { StorageAccessLevel } from 'aws-amplify/storage';
import { FileUploader } from '../../components/content/FileUploader';
import { getStoragePath } from '../../utils/storage';
import { Schema } from '../../../amplify/data/resource';

const client = generateClient<Schema>();

// コンテンツカテゴリー
const CONTENT_CATEGORIES = [
  { value: 'MAIN_STORY', label: 'メインストーリー' },
  { value: 'SIDE_STORY', label: 'サイドストーリー' },
  { value: 'SETTING_MATERIAL', label: '設定資料' },
  { value: 'CHARACTER', label: 'キャラクター' },
  { value: 'ORGANIZATION', label: '組織' },
  { value: 'THEORY', label: '理論' },
];

// 世界カテゴリー
const WORLD_CATEGORIES = [
  { value: 'COMMON', label: '共通' },
  { value: 'QUXE', label: 'クシェ' },
  { value: 'HODEMEI', label: 'ホデメイ' },
  { value: 'ALSAREJIA', label: 'アルサレジア' },
];

// 公開範囲
const VISIBILITY_OPTIONS = [
  { value: 'PUBLIC', label: '公開', accessLevel: 'public' as StorageAccessLevel },
  { value: 'AUTHENTICATED', label: '認証済みユーザーのみ', accessLevel: 'protected' as StorageAccessLevel },
  { value: 'PRIVATE', label: '非公開', accessLevel: 'private' as StorageAccessLevel },
];

interface FormValues {
  title: string;
  description: string;
  primaryTypes: string[];
  primaryCategory: string;
  secondaryCategories: string[];
  worldType: string;
  visibility: string;
  tags: string;
}

const ContentUploadPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ key: string; url: string }>>([]);
  
  const [formValues, setFormValues] = useState<FormValues>({
    title: '',
    description: '',
    primaryTypes: [],
    primaryCategory: 'SIDE_STORY',
    secondaryCategories: [],
    worldType: 'COMMON',
    visibility: 'PRIVATE',
    tags: '',
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
  
  // フォーム入力の処理
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  };
  
  // チェックボックスの処理
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    
    if (name === 'primaryTypes') {
      setFormValues(prev => ({
        ...prev,
        primaryTypes: checked 
          ? [...prev.primaryTypes, value]
          : prev.primaryTypes.filter(type => type !== value)
      }));
    } else if (name === 'secondaryCategories') {
      setFormValues(prev => ({
        ...prev,
        secondaryCategories: checked 
          ? [...prev.secondaryCategories, value]
          : prev.secondaryCategories.filter(category => category !== value)
      }));
    }
  };
  
  // ファイルアップロード成功時の処理
  const handleUploadSuccess = (results: Array<{ key: string; url: string }>) => {
    setUploadedFiles(results);
  };
  
  // ファイルアップロードエラー時の処理
  const handleUploadError = (error: Error) => {
    setError(`アップロードエラー: ${error.message}`);
  };
  
  // コンテンツの保存
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId) {
      setError('ユーザー情報が取得できていません。再度ログインしてください。');
      return;
    }
    
    if (uploadedFiles.length === 0) {
      setError('ファイルをアップロードしてください。');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // メインファイルとアタッチメントを分離
      const mainFile = uploadedFiles[0];
      const attachments = uploadedFiles.slice(1).map(file => file.key);
      
      // タグの分割
      const tagList = formValues.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);
      
      // コンテンツレコードの作成
      const result = await client.models.Content.create({
        title: formValues.title,
        description: formValues.description,
        primaryTypes: formValues.primaryTypes.length > 0 ? formValues.primaryTypes : ['document'],
        primaryCategory: formValues.primaryCategory,
        secondaryCategories: formValues.secondaryCategories,
        worldType: formValues.worldType,
        attribution: 'SHARED',
        visibility: formValues.visibility as 'PUBLIC' | 'AUTHENTICATED' | 'PRIVATE',
        status: 'PUBLISHED',
        tags: tagList,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: '1.0',
        mainKey: mainFile.key,
        thumbnailKey: mainFile.key, // サムネイルが必要な場合は別途処理
        attachments,
        ownerId: userId,
      });
      
      // 成功したら詳細ページに遷移
      navigate(`/user/contents/${result.id}`);
    } catch (err) {
      console.error('コンテンツの保存に失敗しました:', err);
      setError('コンテンツの保存に失敗しました。後でもう一度お試しください。');
    } finally {
      setIsLoading(false);
    }
  };
  
  // 現在の公開範囲に基づくアクセスレベルを取得
  const getCurrentAccessLevel = (): StorageAccessLevel => {
    const visibility = VISIBILITY_OPTIONS.find(opt => opt.value === formValues.visibility);
    return visibility?.accessLevel || 'private';
  };
  
  // 現在のストレージパスを取得
  const getCurrentStoragePath = (): string => {
    if (!userId) return 'temp/uploads';
    
    return getStoragePath(
      formValues.primaryCategory,
      formValues.visibility.toLowerCase() as 'public' | 'authenticated' | 'private',
      userId,
      formValues.primaryTypes[0] || 'document'
    );
  };
  
  return (
    <div className="content-upload-page">
      <h1>コンテンツのアップロード</h1>
      
      {error && (
        <div className="error-alert">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h2>基本情報</h2>
          
          <div className="form-group">
            <label htmlFor="title">タイトル</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formValues.title}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">説明</label>
            <textarea
              id="description"
              name="description"
              value={formValues.description}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>コンテンツタイプ</label>
            <div className="checkbox-group">
              {['document', 'image', 'audio', 'video'].map(type => (
                <label key={type}>
                  <input
                    type="checkbox"
                    name="primaryTypes"
                    value={type}
                    checked={formValues.primaryTypes.includes(type)}
                    onChange={handleCheckboxChange}
                  />
                  {type}
                </label>
              ))}
            </div>
          </div>
        </div>
        
        <div className="form-section">
          <h2>分類</h2>
          
          <div className="form-group">
            <label htmlFor="primaryCategory">主要カテゴリ</label>
            <select
              id="primaryCategory"
              name="primaryCategory"
              value={formValues.primaryCategory}
              onChange={handleInputChange}
              required
            >
              {CONTENT_CATEGORIES.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label>サブカテゴリ（任意）</label>
            <div className="checkbox-group">
              {CONTENT_CATEGORIES.map(category => (
                <label key={category.value}>
                  <input
                    type="checkbox"
                    name="secondaryCategories"
                    value={category.value}
                    checked={formValues.secondaryCategories.includes(category.value)}
                    onChange={handleCheckboxChange}
                  />
                  {category.label}
                </label>
              ))}
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="worldType">世界設定</label>
            <select
              id="worldType"
              name="worldType"
              value={formValues.worldType}
              onChange={handleInputChange}
              required
            >
              {WORLD_CATEGORIES.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="visibility">公開範囲</label>
            <select
              id="visibility"
              name="visibility"
              value={formValues.visibility}
              onChange={handleInputChange}
              required
            >
              {VISIBILITY_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="tags">タグ（カンマ区切り）</label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formValues.tags}
              onChange={handleInputChange}
              placeholder="タグ1, タグ2, タグ3"
            />
          </div>
        </div>
        
        <div className="form-section">
          <h2>ファイルのアップロード</h2>
          
          <FileUploader
            path={getCurrentStoragePath()}
            accessLevel={getCurrentAccessLevel()}
            multiple={true}
            onUploadSuccess={handleUploadSuccess}
            onUploadError={handleUploadError}
          />
        </div>
        
        <div className="form-actions">
          <button 
            type="submit" 
            disabled={isLoading || uploadedFiles.length === 0}
          >
            {isLoading ? 'アップロード中...' : 'コンテンツを保存'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContentUploadPage;