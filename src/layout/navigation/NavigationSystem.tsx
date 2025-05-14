// src/layout/navigation/NavigationSystem.tsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../core/context/ThemeContext';
import { useResponsive } from '../../core/hooks/useResponsive';
import { useNavigation } from '../../core/hooks/useNavigation';
import { 
  NavigationVariant, 
  Orientation, 
  StyleProps 
} from '../../types/common';
import './NavigationSystem.css';

export interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon?: React.ReactNode;
  children?: NavigationItem[];
  disabled?: boolean;
  highlight?: boolean;
}

export interface INavigationSystemProps extends StyleProps {
  /** 現在のパス */
  currentPath?: string;
  /** ナビゲーション項目 */
  items: NavigationItem[];
  /** 表示バリエーション */
  variant?: NavigationVariant;
  /** 折りたたみ可能フラグ */
  collapsible?: boolean;
  /** 方向 */
  orientation?: Orientation;
  /** 表示する階層の深さ */
  depth?: number;
  /** ナビゲーションハンドラ */
  onNavigate?: (path: string) => void;
}

/**
 * サイト内のナビゲーションを担当するコンポーネント
 */
export const NavigationSystem: React.FC<INavigationSystemProps> = ({
  currentPath,
  items,
  variant = 'sidebar',
  collapsible = false,
  orientation = 'vertical',
  depth = 2,
  onNavigate,
  className,
  style,
}) => {
  const location = useLocation();
  const { currentTheme } = useTheme();
  const { isMobile } = useResponsive();
  const { previousPath, navigate: navigateWithHistory } = useNavigation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  
  // 現在のパスを取得
  const activePath = currentPath || location.pathname;
  
  // モバイル時は自動的に折りたたむ
  useEffect(() => {
    if (isMobile && collapsible) {
      setIsCollapsed(true);
    }
  }, [isMobile, collapsible]);
  
  // 折りたたみを切り替える
  const toggleCollapse = () => {
    if (collapsible) {
      setIsCollapsed(!isCollapsed);
    }
  };
  
  // 項目の展開/折りたたみを切り替える
  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  // ナビゲーション処理
  const handleNavigation = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    }
    
    // モバイルでは自動的に折りたたむ
    if (isMobile && collapsible) {
      setIsCollapsed(true);
    }
  };
  
  // アクティブな項目かどうかをチェック
  const isActive = (path: string) => {
    return activePath === path || activePath.startsWith(`${path}/`);
  };
  
  // 項目と子項目を再帰的にレンダリング
  const renderNavItems = (navItems: NavigationItem[], level = 1) => {
    if (level > depth) return null;
    
    return (
      <ul className={`navigation__list navigation__list--level-${level}`}>
        {navItems.map((item) => {
          const isItemActive = isActive(item.path);
          const hasChildren = item.children && item.children.length > 0;
          const isExpanded = expandedItems[item.id] || false;
          
          // アクティブな項目の親項目を自動的に展開
          if (hasChildren && isItemActive && !isExpanded) {
            setExpandedItems(prev => ({
              ...prev,
              [item.id]: true
            }));
          }
          
          return (
            <li 
              key={item.id} 
              className={`
                navigation__item
                ${isItemActive ? 'navigation__item--active' : ''}
                ${item.disabled ? 'navigation__item--disabled' : ''}
                ${item.highlight ? 'navigation__item--highlight' : ''}
                ${isExpanded && hasChildren ? 'navigation__item--expanded' : ''}
              `}
            >
              <Link
                to={item.path}
                className="navigation__link"
                onClick={(e) => {
                  if (item.disabled) {
                    e.preventDefault();
                    return;
                  }
                  
                  handleNavigation(item.path);
                }}
                aria-current={isItemActive ? 'page' : undefined}
                aria-disabled={item.disabled}
              >
                {item.icon && (
                  <span className="navigation__icon">{item.icon}</span>
                )}
                <span className="navigation__label">{item.label}</span>
                
                {hasChildren && (
                  <span 
                    className="navigation__dropdown-indicator"
                    onClick={(e) => toggleExpand(item.id, e)}
                    role="button"
                    aria-label={isExpanded ? "Collapse" : "Expand"}
                    tabIndex={0}
                  >
                    ▼
                  </span>
                )}
              </Link>
              
              {hasChildren && (isExpanded || variant === 'dropdown') && level < depth && (
                renderNavItems(item.children!, level + 1)
              )}
            </li>
          );
        })}
      </ul>
    );
  };

  // 戻るボタンハンドラー
  const handleBack = () => {
    if (previousPath) {
      navigateWithHistory(previousPath);
    }
  };

  return (
    <nav 
      className={`
        navigation 
        navigation--${variant}
        navigation--${orientation}
        navigation--${currentTheme}
        ${isCollapsed ? 'navigation--collapsed' : ''}
        ${className || ''}
      `}
      aria-label="Main navigation"
      style={style}
    >
      {collapsible && (
        <button 
          className="navigation__toggle"
          onClick={toggleCollapse}
          aria-expanded={!isCollapsed}
          aria-label={isCollapsed ? "Expand navigation" : "Collapse navigation"}
        >
          {isCollapsed ? '≫' : '≪'}
        </button>
      )}
      
      {previousPath && (
        <button 
          className="navigation__back-button"
          onClick={handleBack}
          aria-label="前のページに戻る"
        >
          ← 戻る
        </button>
      )}
      
      {renderNavItems(items)}
    </nav>
  );
};

export default NavigationSystem;