// src/layout/base/BaseLayout.tsx
import React, { useEffect, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useTheme } from '../../core/context/ThemeContext';
import { useResponsive } from '../../core/hooks/useResponsive';
import { useNavigation, Breadcrumb } from '../../core/hooks/useNavigation';
import { WorldType, StyleProps } from '../../types/common';
import './BaseLayout.css';

export interface IBaseLayoutProps extends StyleProps {
  /** カスタムヘッダーコンテンツ */
  headerContent?: React.ReactNode;
  /** カスタムフッターコンテンツ */
  footerContent?: React.ReactNode;
  /** サイドバーコンテンツ */
  sidebarContent?: React.ReactNode;
  /** 背景色 */
  backgroundColor?: string;
  /** 世界テーマ */
  worldTheme?: WorldType;
  /** コンテンツ最大幅 */
  maxWidth?: string | number;
  /** パディング */
  padding?: string | number;
  /** パンくずリスト表示フラグ */
  showBreadcrumbs?: boolean;
  /** フッター表示フラグ */
  showFooter?: boolean;
  /** 子要素 */
  children?: React.ReactNode;
}

/**
 * サイト全体のベースとなるレイアウトコンポーネント
 */
export const BaseLayout: React.FC<IBaseLayoutProps> = ({
  headerContent,
  footerContent,
  sidebarContent,
  backgroundColor,
  worldTheme,
  maxWidth = '1200px',
  padding,
  showBreadcrumbs = false,
  showFooter = true,
  children,
  className,
  style,
}) => {
  const { currentTheme, setTheme } = useTheme();
  const { isMobile } = useResponsive();
  const { breadcrumbs } = useNavigation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);
  const theme = worldTheme || currentTheme;
  
  // 世界テーマが指定されていれば適用
  useEffect(() => {
    if (worldTheme) {
      setTheme(worldTheme);
    }
  }, [worldTheme, setTheme]);
  
  // レスポンシブ対応: モバイルではサイドバーを閉じる
  useEffect(() => {
    setIsSidebarOpen(!isMobile);
  }, [isMobile]);
  
  // サイドバーの開閉を切り替える
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  // パンくずリストをレンダリング
  const renderBreadcrumbs = () => {
    return (
      <div className="base-layout__breadcrumbs" role="navigation" aria-label="Breadcrumbs">
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          
          return (
            <div key={crumb.path} className="base-layout__breadcrumb-item">
              {isLast ? (
                <span className="base-layout__breadcrumb-current">{crumb.label}</span>
              ) : (
                <>
                  <Link to={crumb.path} className="base-layout__breadcrumb-link">
                    {crumb.label}
                  </Link>
                  <span className="base-layout__breadcrumb-separator">/</span>
                </>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div 
      className={`base-layout base-layout--${theme} ${className || ''}`}
      style={{ 
        ...style,
        backgroundColor: backgroundColor || undefined
      }}
    >
      <header className="base-layout__header">
        {headerContent || <div className="base-layout__default-header">Project Niferche</div>}
      </header>
      
      <div className="base-layout__content-wrapper">
        {sidebarContent && (
          <aside 
            className={`base-layout__sidebar ${isSidebarOpen ? 'base-layout__sidebar--open' : ''}`}
            aria-hidden={!isSidebarOpen}
          >
            {sidebarContent}
          </aside>
        )}
        
        <main 
          className="base-layout__main"
          style={{ 
            maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth,
            padding: padding ? (typeof padding === 'number' ? `${padding}px` : padding) : undefined,
            margin: '0 auto',
            width: '100%'
          }}
        >
          {showBreadcrumbs && renderBreadcrumbs()}
          
          {children || <Outlet />}
        </main>
        
        {isMobile && sidebarContent && (
          <button 
            className="base-layout__sidebar-toggle"
            onClick={toggleSidebar}
            aria-expanded={isSidebarOpen}
            aria-controls="sidebar"
            aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            {isSidebarOpen ? '×' : '☰'}
          </button>
        )}
      </div>
      
      {showFooter && (
        <footer className="base-layout__footer">
          {footerContent || (
            <div className="base-layout__default-footer">
              <div>&copy; {new Date().getFullYear()} Project Niferche</div>
              <div>
                <Link to="/terms" className="mr-3">利用規約</Link>
                <Link to="/privacy">プライバシーポリシー</Link>
              </div>
            </div>
          )}
        </footer>
      )}
    </div>
  );
};

export default BaseLayout;