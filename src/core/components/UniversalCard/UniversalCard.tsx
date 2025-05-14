// src/core/components/UniversalCard/UniversalCard.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { 
  WorldType, 
  AttributeType, 
  Size, 
  CardVariant, 
  StyleProps 
} from '../../../types/common';
import './UniversalCard.css';

export interface IUniversalCardProps extends StyleProps {
  /** カードのID */
  id?: string;
  /** カードのタイトル */
  title: string;
  /** 説明文 */
  description?: string;
  /** 画像URL */
  imageUrl?: string;
  /** 遷移先パス */
  linkTo?: string;
  /** タグリスト */
  tags?: string[];
  /** 世界タイプ */
  world?: WorldType;
  /** 属性タイプ */
  attribute?: AttributeType;
  /** サイズバリエーション */
  size?: Size;
  /** 表示バリエーション */
  variant?: CardVariant;
  /** クリックハンドラ */
  onClick?: (id: string) => void;
  /** カスタムヘッダーレンダラー */
  renderHeader?: () => React.ReactNode;
  /** カスタムフッターレンダラー */
  renderFooter?: () => React.ReactNode;
  /** カスタムコンテンツレンダラー */
  renderContent?: () => React.ReactNode;
  /** 利用可能フラグ */
  isAvailable?: boolean;
}

/**
 * 汎用的なカードコンポーネント
 * さまざまなコンテンツタイプや世界観に対応する柔軟なカード
 */
export const UniversalCard: React.FC<IUniversalCardProps> = ({
  id,
  title,
  description,
  imageUrl,
  linkTo,
  tags,
  world,
  attribute,
  size = 'medium',
  variant = 'story',
  onClick,
  renderHeader,
  renderFooter,
  renderContent,
  isAvailable = true,
  className,
  style,
}) => {
  const { currentTheme } = useTheme();
  const navigate = useNavigate();
  const cardTheme = world || currentTheme;
  
  const handleClick = (e: React.MouseEvent) => {
    if (!isAvailable) return;
    
    if (onClick && id) {
      onClick(id);
    }
    
    if (linkTo) {
      e.preventDefault();
      navigate(linkTo);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isAvailable) return;
    
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      
      if (onClick && id) {
        onClick(id);
      }
      
      if (linkTo) {
        navigate(linkTo);
      }
    }
  };
  
  // 画像読み込みエラー時のハンドラ
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    // フォールバック画像を設定
    e.currentTarget.src = '/images/fallback.jpg';
    e.currentTarget.onerror = null; // 無限ループを防ぐ
  };

  return (
    <div
      className={`
        universal-card
        universal-card--${size}
        universal-card--${variant}
        universal-card--${cardTheme}
        ${isAvailable ? '' : 'universal-card--disabled'}
        ${className || ''}
      `}
      style={style}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role={linkTo || onClick ? 'button' : undefined}
      tabIndex={isAvailable && (linkTo || onClick) ? 0 : -1}
      aria-disabled={!isAvailable}
    >
      {renderHeader ? (
        renderHeader()
      ) : (
        <div className="universal-card__header">
          {tags && tags.length > 0 && (
            <div className="universal-card__tags">
              {tags.map((tag, index) => (
                <span key={index} className="universal-card__tag">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
      
      {renderContent ? (
        renderContent()
      ) : (
        <div className="universal-card__content">
          {imageUrl && (
            <div className="universal-card__image-container">
              <img
                src={imageUrl}
                alt={title}
                className="universal-card__image"
                loading="lazy"
                onError={handleImageError}
              />
            </div>
          )}
          
          <div className="universal-card__text-content">
            <h3 className="universal-card__title">{title}</h3>
            
            {description && (
              <p className="universal-card__description">
                {description}
              </p>
            )}
          </div>
        </div>
      )}
      
      {renderFooter ? (
        renderFooter()
      ) : (
        <div className="universal-card__footer">
          {attribute && (
            <span className="universal-card__attribute">
              {attribute}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default UniversalCard;