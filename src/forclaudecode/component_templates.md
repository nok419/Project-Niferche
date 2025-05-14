# コンポーネントテンプレート

## 基本コンポーネントテンプレート

```tsx
import React from 'react';
import { useTheme } from '../../core/hooks/useTheme';
import { StyleProps } from '../../types/common';

export interface IComponentProps extends StyleProps {
  /** プロパティの説明 */
  propName: string;
  /** 任意のプロパティの説明 */
  optionalProp?: number;
  /** コールバックの説明 */
  onSomeEvent?: (value: string) => void;
}

/**
 * コンポーネントの説明
 */
export const Component: React.FC<IComponentProps> = ({
  propName,
  optionalProp,
  onSomeEvent,
  className,
  style,
}) => {
  const { currentTheme } = useTheme();
  
  const handleClick = () => {
    if (onSomeEvent) {
      onSomeEvent(propName);
    }
  };

  return (
    <div
      className={`component component--${currentTheme} ${className || ''}`}
      style={style}
      onClick={handleClick}
    >
      <h2>{propName}</h2>
      {optionalProp && <p>Optional value: {optionalProp}</p>}
    </div>
  );
};
```

## UniversalCardコンポーネントテンプレート

```tsx
import React from 'react';
import { useTheme } from '../../core/hooks/useTheme';
import { useNavigate } from 'react-router-dom';
import { WorldType, AttributeType } from '../../types/common';

export interface IUniversalCardProps {
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
  size?: 'small' | 'medium' | 'large';
  /** 表示バリエーション */
  variant?: 'story' | 'material' | 'gallery' | 'laboratory';
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
  /** クラス名 */
  className?: string;
  /** インラインスタイル */
  style?: React.CSSProperties;
}

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
  
  const handleClick = () => {
    if (!isAvailable) return;
    
    if (onClick && id) {
      onClick(id);
    }
    
    if (linkTo) {
      navigate(linkTo);
    }
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
      role="button"
      tabIndex={isAvailable ? 0 : -1}
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
```

## BaseLayoutコンポーネントテンプレート

```tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { useTheme } from '../../core/hooks/useTheme';
import { WorldType } from '../../types/common';

export interface IBaseLayoutProps {
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

export const BaseLayout: React.FC<IBaseLayoutProps> = ({
  headerContent,
  footerContent,
  sidebarContent,
  backgroundColor,
  worldTheme,
  maxWidth = '1200px',
  padding = '1rem',
  showBreadcrumbs = false,
  showFooter = true,
  children,
}) => {
  const { currentTheme, setTheme } = useTheme();
  const theme = worldTheme || currentTheme;
  
  // 世界テーマが指定されていれば適用
  React.useEffect(() => {
    if (worldTheme) {
      setTheme(worldTheme);
    }
  }, [worldTheme, setTheme]);

  return (
    <div 
      className={`base-layout base-layout--${theme}`}
      style={{ backgroundColor }}
    >
      <header className="base-layout__header">
        {headerContent || <div className="base-layout__default-header">Default Header</div>}
      </header>
      
      <div className="base-layout__content-wrapper">
        {sidebarContent && (
          <aside className="base-layout__sidebar">
            {sidebarContent}
          </aside>
        )}
        
        <main 
          className="base-layout__main"
          style={{ 
            maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth,
            padding: typeof padding === 'number' ? `${padding}px` : padding
          }}
        >
          {showBreadcrumbs && (
            <div className="base-layout__breadcrumbs">
              {/* Breadcrumbs component would go here */}
            </div>
          )}
          
          {children || <Outlet />}
        </main>
      </div>
      
      {showFooter && (
        <footer className="base-layout__footer">
          {footerContent || (
            <div className="base-layout__default-footer">
              &copy; {new Date().getFullYear()} Project Niferche
            </div>
          )}
        </footer>
      )}
    </div>
  );
};
```

## NavigationSystemコンポーネントテンプレート

```tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../core/hooks/useTheme';
import { useResponsive } from '../../core/hooks/useResponsive';

export interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon?: string;
  children?: NavigationItem[];
  disabled?: boolean;
  highlight?: boolean;
}

export interface INavigationProps {
  /** 現在のパス */
  currentPath?: string;
  /** ナビゲーション項目 */
  items: NavigationItem[];
  /** 表示バリエーション */
  variant?: 'sidebar' | 'dropdown' | 'tabs' | 'cards';
  /** 折りたたみ可能フラグ */
  collapsible?: boolean;
  /** 方向 */
  orientation?: 'horizontal' | 'vertical';
  /** 表示する階層の深さ */
  depth?: number;
  /** ナビゲーションハンドラ */
  onNavigate?: (path: string) => void;
  /** クラス名 */
  className?: string;
}

export const NavigationSystem: React.FC<INavigationProps> = ({
  currentPath,
  items,
  variant = 'sidebar',
  collapsible = false,
  orientation = 'vertical',
  depth = 1,
  onNavigate,
  className,
}) => {
  const location = useLocation();
  const { currentTheme } = useTheme();
  const { isMobile } = useResponsive();
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  
  // 現在のパスを取得
  const activePath = currentPath || location.pathname;
  
  // モバイル時は自動的に折りたたむ
  React.useEffect(() => {
    if (isMobile && collapsible) {
      setIsCollapsed(true);
    }
  }, [isMobile, collapsible]);
  
  const toggleCollapse = () => {
    if (collapsible) {
      setIsCollapsed(!isCollapsed);
    }
  };
  
  const handleNavigation = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    }
    
    // モバイルでは自動的に折りたたむ
    if (isMobile && collapsible) {
      setIsCollapsed(true);
    }
  };
  
  const renderNavItems = (navItems: NavigationItem[], level = 1) => {
    if (level > depth) return null;
    
    return (
      <ul className={`navigation__list navigation__list--level-${level}`}>
        {navItems.map((item) => {
          const isActive = activePath === item.path;
          const hasChildren = item.children && item.children.length > 0;
          
          return (
            <li 
              key={item.id} 
              className={`
                navigation__item
                ${isActive ? 'navigation__item--active' : ''}
                ${item.disabled ? 'navigation__item--disabled' : ''}
                ${item.highlight ? 'navigation__item--highlight' : ''}
              `}
            >
              <Link
                to={item.path}
                className="navigation__link"
                onClick={() => !item.disabled && handleNavigation(item.path)}
                aria-current={isActive ? 'page' : undefined}
                tabIndex={item.disabled ? -1 : 0}
              >
                {item.icon && (
                  <span className="navigation__icon">{item.icon}</span>
                )}
                <span className="navigation__label">{item.label}</span>
              </Link>
              
              {hasChildren && level < depth && (
                renderNavItems(item.children!, level + 1)
              )}
            </li>
          );
        })}
      </ul>
    );
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
    >
      {collapsible && (
        <button 
          className="navigation__toggle"
          onClick={toggleCollapse}
          aria-expanded={!isCollapsed}
        >
          {isCollapsed ? 'Expand' : 'Collapse'} Menu
        </button>
      )}
      
      {renderNavItems(items)}
    </nav>
  );
};
```

## フックテンプレート

### useTheme フック

```tsx
import React from 'react';
import { WorldType } from '../../types/common';

interface ThemeContextValue {
  currentTheme: WorldType;
  setTheme: (theme: WorldType) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const ThemeContext = React.createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = React.useState<WorldType>('hodemei');
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  
  const setTheme = (theme: WorldType) => {
    setCurrentTheme(theme);
    // テーマをルート要素に適用するロジック
    document.documentElement.setAttribute('data-theme', theme);
  };
  
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // ダークモードをルート要素に適用するロジック
    document.documentElement.setAttribute('data-dark-mode', (!isDarkMode).toString());
  };
  
  // 初期設定
  React.useEffect(() => {
    // デフォルトテーマを適用
    setTheme(currentTheme);
    
    // システムの色設定を確認
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);
    document.documentElement.setAttribute('data-dark-mode', prefersDark.toString());
  }, []);
  
  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme, isDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextValue => {
  const context = React.useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
```

### useResponsive フック

```tsx
import { useState, useEffect } from 'react';

const breakpoints = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1400
};

type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

interface ResponsiveReturn {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  currentBreakpoint: Breakpoint;
  width: number;
  height: number;
}

export const useResponsive = (): ResponsiveReturn => {
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);
  
  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // 現在のブレークポイントを判定
  const getCurrentBreakpoint = (): Breakpoint => {
    if (width >= breakpoints.xxl) return 'xxl';
    if (width >= breakpoints.xl) return 'xl';
    if (width >= breakpoints.lg) return 'lg';
    if (width >= breakpoints.md) return 'md';
    if (width >= breakpoints.sm) return 'sm';
    return 'xs';
  };
  
  const currentBreakpoint = getCurrentBreakpoint();
  
  return {
    isMobile: width < breakpoints.md,
    isTablet: width >= breakpoints.md && width < breakpoints.lg,
    isDesktop: width >= breakpoints.lg,
    currentBreakpoint,
    width,
    height
  };
};
```

### useNavigation フック

```tsx
import { useState, useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface Breadcrumb {
  label: string;
  path: string;
}

interface NavigationContextValue {
  currentPath: string;
  navigate: (path: string) => void;
  breadcrumbs: Breadcrumb[];
  previousPath: string | null;
}

// パスからパンくずリストを生成するヘルパー関数
const generateBreadcrumbs = (path: string): Breadcrumb[] => {
  // 実際の実装ではパスからラベルを取得するロジックが必要
  const pathSegments = path.split('/').filter(segment => segment !== '');
  let currentPath = '';
  
  return pathSegments.map(segment => {
    currentPath += `/${segment}`;
    // ここでセグメントからラベルを生成（実際の実装では翻訳やマッピングが必要）
    const label = segment.charAt(0).toUpperCase() + segment.slice(1);
    return { label, path: currentPath };
  });
};

export const useNavigation = (): NavigationContextValue => {
  const location = useLocation();
  const navigate = useNavigate();
  const [previousPath, setPreviousPath] = useState<string | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);
  
  // 現在のパス
  const currentPath = location.pathname;
  
  // パスが変わったらパンくずリストを更新
  useEffect(() => {
    setBreadcrumbs([
      { label: 'Home', path: '/' },
      ...generateBreadcrumbs(currentPath)
    ]);
    
    // 前のパスを記録
    if (currentPath !== previousPath) {
      setPreviousPath(currentPath);
    }
  }, [currentPath]);
  
  // ナビゲーション関数
  const handleNavigate = useCallback((path: string) => {
    navigate(path);
  }, [navigate]);
  
  return {
    currentPath,
    navigate: handleNavigate,
    breadcrumbs,
    previousPath
  };
};
```