// src/components/navigation/WorldNavigation.tsx
import React, { memo, useCallback, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { WorldType } from '../../types/common';
import './WorldNavigation.css';

export interface IWorldNavigationProps {
  /** 現在の世界タイプ */
  worldType: WorldType;
  /** 表示モード (アイコンのみ、カード、タブなど) */
  mode?: 'icon' | 'card' | 'tab';
  /** クラス名 */
  className?: string;
  /** アクセシビリティラベル */
  ariaLabel?: string;
}

// WorldIcon コンポーネント - ボタンの繰り返しを抽出
const WorldIcon = memo(({ 
  world, 
  currentWorldType,
  info,
  onSelect,
  onKeyDown 
}: { 
  world: WorldType;
  currentWorldType: WorldType;
  info: { primaryColor: string; name: string; };
  onSelect: (world: WorldType) => void;
  onKeyDown: (event: React.KeyboardEvent, world: WorldType) => void;
}) => {
  const isActive = currentWorldType === world;
  const letter = world.charAt(0).toUpperCase();
  
  return (
    <div 
      className={`world-icon ${isActive ? 'active' : ''}`}
      onClick={() => onSelect(world)}
      onKeyDown={(e) => onKeyDown(e, world)}
      style={{ backgroundColor: info.primaryColor }}
      title={info.name}
      role="button"
      tabIndex={0}
      aria-label={`${info.name}世界に移動`}
      aria-pressed={isActive}
    >
      <span>{letter}</span>
    </div>
  );
});

// WorldButton コンポーネント - 選択ボタンの繰り返しを抽出
const WorldButton = memo(({ 
  world, 
  currentWorldType,
  info,
  onSelect,
  onKeyDown 
}: { 
  world: WorldType;
  currentWorldType: WorldType;
  info: { primaryColor: string; name: string; };
  onSelect: (world: WorldType) => void;
  onKeyDown: (event: React.KeyboardEvent, world: WorldType) => void;
}) => {
  const isActive = currentWorldType === world;
  
  return (
    <button 
      className={isActive ? 'active' : ''} 
      onClick={() => onSelect(world)}
      onKeyDown={(e) => onKeyDown(e, world)}
      style={{ 
        backgroundColor: isActive ? info.primaryColor : 'transparent' 
      }}
      aria-checked={isActive}
      aria-label={`${info.name}世界を選択`}
      tabIndex={0}
      role="radio"
    >
      {info.name}
    </button>
  );
});

// WorldTab コンポーネント - タブの繰り返しを抽出
const WorldTab = memo(({ 
  world, 
  currentWorldType,
  info,
  onSelect,
  onKeyDown 
}: { 
  world: WorldType;
  currentWorldType: WorldType;
  info: { primaryColor: string; name: string; };
  onSelect: (world: WorldType) => void;
  onKeyDown: (event: React.KeyboardEvent, world: WorldType) => void;
}) => {
  const isActive = currentWorldType === world;
  
  return (
    <button
      className={`world-tab ${isActive ? 'active' : ''}`}
      onClick={() => onSelect(world)}
      onKeyDown={(e) => onKeyDown(e, world)}
      style={{ 
        borderBottomColor: isActive ? info.primaryColor : 'transparent' 
      }}
      role="tab"
      id={`tab-${world}`}
      aria-selected={isActive}
      aria-controls={`panel-${world}`}
      tabIndex={isActive ? 0 : -1}
    >
      {info.name}
    </button>
  );
});

// NavigationLink コンポーネント - ナビゲーションリンクの繰り返しを抽出
const NavigationLink = memo(({ 
  item, 
  color 
}: { 
  item: { id: string; label: string; path: string; };
  color: string;
}) => (
  <Link 
    key={item.id} 
    to={item.path}
    className="world-navigation-card"
    style={{ borderColor: color }}
    aria-label={`${item.label}のページに移動`}
  >
    {item.label}
  </Link>
));

/**
 * 世界タイプに応じたナビゲーションを提供するコンポーネント
 * メモ化と最適化を適用
 */
export const WorldNavigation: React.FC<IWorldNavigationProps> = memo((props: IWorldNavigationProps) => {
  const {
    worldType,
    mode = 'card',
    className = '',
    ariaLabel = '世界選択ナビゲーション',
  } = props;
  const navigate = useNavigate();
  const location = useLocation();

  // 世界ナビゲーションの基本情報（メモ化）
  const worldsInfo = useMemo(() => ({
    hodemei: {
      name: 'Hodemei',
      description: '科学と理性の世界',
      imagePath: '/images/hodemei-bg.jpg',
      primaryColor: 'var(--hodemei-primary)',
      navItems: [
        { id: 'hodemei-story', label: 'メインストーリー', path: '/project-niferche/main-story' },
        { id: 'hodemei-side-stories', label: 'サイドストーリー', path: '/project-niferche/side-story?world=hodemei' },
        { id: 'hodemei-materials', label: '設定資料', path: '/project-niferche/materials/world/hodemei' },
        { id: 'hodemei-characters', label: '登場人物', path: '/project-niferche/characters?world=hodemei' },
        { id: 'hodemei-glossary', label: '用語集', path: '/project-niferche/glossary?world=hodemei' },
      ]
    },
    quxe: {
      name: 'Quxe',
      description: '自然と感性の世界',
      imagePath: '/images/quxe-bg.jpg',
      primaryColor: 'var(--quxe-primary)',
      navItems: [
        { id: 'quxe-story', label: 'メインストーリー', path: '/project-niferche/main-story' },
        { id: 'quxe-side-stories', label: 'サイドストーリー', path: '/project-niferche/side-story?world=quxe' },
        { id: 'quxe-materials', label: '設定資料', path: '/project-niferche/materials/world/quxe' },
        { id: 'quxe-characters', label: '登場人物', path: '/project-niferche/characters?world=quxe' },
        { id: 'quxe-glossary', label: '用語集', path: '/project-niferche/glossary?world=quxe' },
      ]
    },
    alsarejia: {
      name: 'Alsarejia',
      description: '次元の境界',
      imagePath: '/images/alsarejia-bg.jpg',
      primaryColor: 'var(--alsarejia-primary)',
      navItems: [
        { id: 'alsarejia-story', label: 'メインストーリー', path: '/project-niferche/main-story' },
        { id: 'alsarejia-side-stories', label: 'サイドストーリー', path: '/project-niferche/side-story?world=alsarejia' },
        { id: 'alsarejia-materials', label: '設定資料', path: '/project-niferche/materials/world/alsarejia' },
        { id: 'alsarejia-characters', label: '登場人物', path: '/project-niferche/characters?world=alsarejia' },
        { id: 'alsarejia-glossary', label: '用語集', path: '/project-niferche/glossary?world=alsarejia' },
      ]
    },
    laboratory: {
      name: 'Laboratory',
      description: '実験的創作の場',
      imagePath: '/images/laboratory-bg.jpg',
      primaryColor: 'var(--laboratory-primary)',
      navItems: [
        { id: 'lab-home', label: 'ラボラトリーホーム', path: '/laboratory/home' },
        { id: 'lab-parallel', label: 'Parallel', path: '/laboratory/parallel' },
        { id: 'lab-lcb', label: 'LCB', path: '/laboratory/lcb' },
        { id: 'lab-experiments', label: '実験', path: '/laboratory/experiments' },
      ]
    },
    common: {
      name: 'Project Niferche',
      description: '三つの世界を繋ぐ物語',
      imagePath: '/images/niferche-bg.jpg',
      primaryColor: 'var(--primary)',
      navItems: [
        { id: 'common-main', label: 'Project Niferche', path: '/project-niferche/top' },
        { id: 'common-story', label: 'メインストーリー', path: '/project-niferche/main-story' },
        { id: 'common-side-stories', label: 'サイドストーリー', path: '/project-niferche/side-story' },
        { id: 'common-materials', label: '設定資料', path: '/project-niferche/materials' },
        { id: 'common-glossary', label: '用語集', path: '/project-niferche/glossary' },
      ]
    }
  }), []); // 依存配列が空のため、マウント時のみ生成

  // 現在の世界情報をメモ化
  const currentWorld = useMemo(() => worldsInfo[worldType], [worldType, worldsInfo]);
  
  // 現在の世界を判断するヘルパー関数をメモ化
  const getCurrentWorld = useCallback((path: string): WorldType => {
    if (path.includes('/laboratory')) return 'laboratory';
    if (path.includes('/hodemei')) return 'hodemei';
    if (path.includes('/quxe')) return 'quxe';
    if (path.includes('/alsarejia')) return 'alsarejia';
    return 'common';
  }, []);

  // 世界選択ハンドラー（メモ化）
  const handleWorldSelect = useCallback((world: WorldType) => {
    // 現在のパスを取得
    const currentPath = location.pathname;
    
    // 現在の世界
    const currentWorld = getCurrentWorld(currentPath);
    
    // 世界が変わらない場合は何もしない
    if (world === currentWorld) return;
    
    // パス構造を分析
    const pathParts = currentPath.split('/').filter(part => part);
    
    // 各世界のベースパスを定義
    const worldBasePaths = {
      laboratory: '/laboratory',
      hodemei: '/project-niferche',
      quxe: '/project-niferche',
      alsarejia: '/project-niferche',
      common: '/project-niferche'
    };
    
    // 新しい世界のベースパス
    const newBasePath = worldBasePaths[world];
    
    // ラボラトリーと他の世界間で移動する場合のパスマッピング
    const pathMapping: Record<string, Record<string, string>> = {
      toLaboratory: {
        'main-story': 'experiments',
        'side-story': 'parallel',
        'materials': 'home',
        'characters': 'lcb',
        'glossary': 'home'
      },
      fromLaboratory: {
        'home': 'materials',
        'experiments': 'main-story',
        'parallel': 'side-story',
        'lcb': 'characters'
      }
    };
    
    let newPath = '';
    const searchParams = new URLSearchParams(location.search);
    
    // 移動先のパスを構築
    if (currentWorld === 'laboratory' && world !== 'laboratory') {
      // ラボラトリーから他の世界への移動
      const contentType = pathParts[1] || 'home';
      const mappedType = pathMapping.fromLaboratory[contentType] || 'materials';
      
      if (mappedType === 'materials') {
        newPath = `${newBasePath}/${mappedType}/world/${world}`;
      } else if (['side-story', 'characters', 'glossary'].includes(mappedType)) {
        newPath = `${newBasePath}/${mappedType}`;
        searchParams.set('world', world);
      } else {
        newPath = `${newBasePath}/${mappedType}`;
      }
    } else if (world === 'laboratory') {
      // 他の世界からラボラトリーへの移動
      const contentType = pathParts[1] || 'materials';
      const mappedType = pathMapping.toLaboratory[contentType] || 'home';
      newPath = `${newBasePath}/${mappedType}`;
    } else {
      // 同じ区画内での世界移動（例：HodemeiからQuxeへ）
      if (pathParts[1] === 'materials' && pathParts[2] === 'world') {
        // 設定資料ページでの世界切り替え
        newPath = `${newBasePath}/materials/world/${world}`;
      } else if (['side-story', 'characters', 'glossary'].includes(pathParts[1])) {
        // クエリパラメータで世界を指定するページ
        newPath = currentPath;
        searchParams.set('world', world);
      } else {
        // その他のページ
        newPath = `${newBasePath}/${pathParts[1] || 'top'}`;
      }
    }
    
    // クエリパラメータを追加
    const queryString = searchParams.toString();
    const finalPath = queryString ? `${newPath}?${queryString}` : newPath;
    
    // 新しいパスに移動
    navigate(finalPath);
  }, [location, navigate, getCurrentWorld]);

  // キーボードハンドラー（メモ化）
  const handleKeyDown = useCallback((event: React.KeyboardEvent, world: WorldType) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleWorldSelect(world);
    }
  }, [handleWorldSelect]);

  // アイコンモードのレンダリング（メモ化）
  const renderIconMode = useCallback(() => {
    // サポートする世界のリスト
    const worlds: WorldType[] = ['hodemei', 'quxe', 'alsarejia', 'laboratory'];
    
    return (
      <div className="world-navigation-icons" role="toolbar" aria-label={`${ariaLabel} - アイコン`}>
        {worlds.map(world => (
          <WorldIcon
            key={world}
            world={world}
            currentWorldType={worldType}
            info={worldsInfo[world]}
            onSelect={handleWorldSelect}
            onKeyDown={handleKeyDown}
          />
        ))}
      </div>
    );
  }, [ariaLabel, worldType, worldsInfo, handleWorldSelect, handleKeyDown]);

  // カードモードのレンダリング（メモ化）
  const renderCardMode = useCallback(() => {
    // サポートする世界のリスト
    const worlds: WorldType[] = ['hodemei', 'quxe', 'alsarejia', 'laboratory'];
    
    return (
      <>
        <div className="world-navigation-header">
          <h2 className="world-navigation-title" style={{ color: currentWorld.primaryColor }}>
            {currentWorld.name}
          </h2>
          <p className="world-navigation-description">{currentWorld.description}</p>
        </div>
        
        <nav className="world-navigation-cards" aria-label={`${currentWorld.name}のナビゲーション`}>
          {currentWorld.navItems.map(item => (
            <NavigationLink
              key={item.id}
              item={item}
              color={currentWorld.primaryColor}
            />
          ))}
        </nav>
        
        <div className="world-navigation-selector" role="group" aria-label="世界を選択">
          <span id="world-selector-label">世界を選択:</span>
          <div className="world-selector-buttons" role="radiogroup" aria-labelledby="world-selector-label">
            {worlds.map(world => (
              <WorldButton
                key={world}
                world={world}
                currentWorldType={worldType}
                info={worldsInfo[world]}
                onSelect={handleWorldSelect}
                onKeyDown={handleKeyDown}
              />
            ))}
          </div>
        </div>
      </>
    );
  }, [currentWorld, worldType, worldsInfo, handleWorldSelect, handleKeyDown]);

  // タブのキーボードナビゲーションハンドラー（メモ化）
  const handleTabKeyDown = useCallback((event: React.KeyboardEvent, world: WorldType) => {
    // サポートする世界のリスト
    const worlds: WorldType[] = ['hodemei', 'quxe', 'alsarejia', 'laboratory'];
    
    // Arrow キーによるナビゲーション
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      
      const currentIndex = worlds.indexOf(worldType);
      let newIndex;
      
      if (event.key === 'ArrowRight') {
        newIndex = (currentIndex + 1) % worlds.length;
      } else {
        newIndex = (currentIndex - 1 + worlds.length) % worlds.length;
      }
      
      handleWorldSelect(worlds[newIndex]);
      
      // フォーカスを新しいタブに移動
      const tabElements = document.querySelectorAll('.world-tab');
      if (tabElements[newIndex]) {
        (tabElements[newIndex] as HTMLElement).focus();
      }
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleWorldSelect(world);
    }
  }, [worldType, handleWorldSelect]);

  // タブモードのレンダリング（メモ化）
  const renderTabMode = useCallback(() => {
    // サポートする世界のリスト
    const worlds: WorldType[] = ['hodemei', 'quxe', 'alsarejia', 'laboratory'];
    
    return (
      <div className="world-navigation-tabs">
        <div 
          className="world-tabs" 
          role="tablist" 
          aria-label="世界選択"
          aria-orientation="horizontal"
        >
          {worlds.map(world => (
            <WorldTab
              key={world}
              world={world}
              currentWorldType={worldType}
              info={worldsInfo[world]}
              onSelect={handleWorldSelect}
              onKeyDown={handleTabKeyDown}
            />
          ))}
        </div>
        
        <div 
          className="content-tabs" 
          role="tabpanel" 
          id={`panel-${worldType}`}
          aria-labelledby={`tab-${worldType}`}
          tabIndex={0}
        >
          {currentWorld.navItems.map((item) => (
            <Link 
              key={item.id} 
              to={item.path}
              className="content-tab"
              aria-label={`${item.label}へ移動`}
              tabIndex={0}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    );
  }, [worldType, worldsInfo, currentWorld, handleWorldSelect, handleTabKeyDown]);

  return (
    <nav 
      className={`world-navigation world-navigation-${mode} world-${worldType} ${className}`}
      aria-label={ariaLabel}
      data-world={worldType}
      data-mode={mode}
      role="navigation"
    >
      <div className="sr-only" aria-live="polite" aria-atomic="true" role="status">
        {`現在の世界: ${currentWorld.name}`}
      </div>
      {mode === 'icon' && renderIconMode()}
      {mode === 'card' && renderCardMode()}
      {mode === 'tab' && renderTabMode()}
    </nav>
  );
});

export default WorldNavigation;