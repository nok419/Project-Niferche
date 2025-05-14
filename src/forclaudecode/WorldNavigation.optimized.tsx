// src/forclaudecode/WorldNavigation.optimized.tsx
import React, { useCallback, useMemo, memo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { WorldType } from '../types/common';

/**
 * 最適化された世界ナビゲーションコンポーネント
 * 
 * 主な最適化:
 * 1. React.memo を使用して不要な再レンダリングを防止
 * 2. useMemo で大きなデータ構造をメモ化
 * 3. useCallback で関数を再生成しないように最適化
 * 4. サブコンポーネントも memo 化して最適化
 */

// インターフェース定義
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

interface NavItem {
  id: string;
  label: string;
  path: string;
}

interface WorldInfo {
  name: string;
  description: string;
  imagePath: string;
  primaryColor: string;
  navItems: NavItem[];
}

type WorldsInfoType = Record<WorldType, WorldInfo>;

// メモ化されたサブコンポーネント
const WorldButton = memo(({ 
  world, 
  isActive, 
  primaryColor, 
  title, 
  onClick, 
  onKeyDown 
}: { 
  world: WorldType;
  isActive: boolean;
  primaryColor: string;
  title: string;
  onClick: (world: WorldType) => void;
  onKeyDown: (event: React.KeyboardEvent, world: WorldType) => void;
}) => (
  <div 
    className={`world-icon ${isActive ? 'active' : ''}`}
    onClick={() => onClick(world)}
    onKeyDown={(e) => onKeyDown(e, world)}
    style={{ backgroundColor: isActive ? primaryColor : 'transparent' }}
    title={title}
    role="button"
    tabIndex={0}
    aria-label={`${title}世界に移動`}
    aria-pressed={isActive}
  >
    <span>{world.charAt(0).toUpperCase()}</span>
  </div>
));

const NavigationLink = memo(({ item }: { item: NavItem }) => (
  <a 
    href={item.path}
    className="world-navigation-card"
    aria-label={`${item.label}のページに移動`}
  >
    {item.label}
  </a>
));

// 最適化された世界ナビゲーションコンポーネント（React.memoでラップ）
export const WorldNavigation = memo(({
  worldType,
  mode = 'card',
  className = '',
  ariaLabel = '世界選択ナビゲーション',
}: IWorldNavigationProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // useMemo で世界情報をメモ化（依存配列が空なので、マウント時のみ計算）
  const worldsInfo = useMemo<WorldsInfoType>(() => ({
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
  }), []);

  // 現在の世界情報をメモ化（worldType が変わった時のみ再計算）
  const currentWorld = useMemo(() => worldsInfo[worldType], [worldType, worldsInfo]);
  
  // getCurrentWorld 関数をメモ化
  const getCurrentWorld = useCallback((path: string): WorldType => {
    if (path.includes('/laboratory')) return 'laboratory';
    if (path.includes('/hodemei')) return 'hodemei';
    if (path.includes('/quxe')) return 'quxe';
    if (path.includes('/alsarejia')) return 'alsarejia';
    return 'common';
  }, []);
  
  // 世界選択ハンドラーをメモ化
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
  
  // キーボードハンドラーをメモ化
  const handleKeyDown = useCallback((event: React.KeyboardEvent, world: WorldType) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleWorldSelect(world);
    }
  }, [handleWorldSelect]);
  
  // アイコンモードのレンダリング関数をメモ化
  const renderIconMode = useCallback(() => (
    <div className="world-navigation-icons" role="toolbar" aria-label={`${ariaLabel} - アイコン`}>
      {(['hodemei', 'quxe', 'alsarejia', 'laboratory'] as WorldType[]).map(world => (
        <WorldButton
          key={world}
          world={world}
          isActive={worldType === world}
          primaryColor={worldsInfo[world].primaryColor}
          title={worldsInfo[world].name}
          onClick={handleWorldSelect}
          onKeyDown={handleKeyDown}
        />
      ))}
    </div>
  ), [worldType, worldsInfo, handleWorldSelect, handleKeyDown, ariaLabel]);
  
  // カードモードのレンダリング関数をメモ化
  const renderCardMode = useCallback(() => (
    <>
      <div className="world-navigation-header">
        <h2 className="world-navigation-title" style={{ color: currentWorld.primaryColor }}>
          {currentWorld.name}
        </h2>
        <p className="world-navigation-description">{currentWorld.description}</p>
      </div>
      
      <nav className="world-navigation-cards" aria-label={`${currentWorld.name}のナビゲーション`}>
        {currentWorld.navItems.map(item => (
          <NavigationLink key={item.id} item={item} />
        ))}
      </nav>
      
      <div className="world-navigation-selector" role="group" aria-label="世界を選択">
        <span id="world-selector-label">世界を選択:</span>
        <div className="world-selector-buttons" role="radiogroup" aria-labelledby="world-selector-label">
          {(['hodemei', 'quxe', 'alsarejia', 'laboratory'] as WorldType[]).map(world => (
            <button 
              key={world}
              className={worldType === world ? 'active' : ''} 
              onClick={() => handleWorldSelect(world)}
              onKeyDown={(e) => handleKeyDown(e, world)}
              style={{ 
                backgroundColor: worldType === world ? 
                  worldsInfo[world].primaryColor : 'transparent' 
              }}
              aria-checked={worldType === world}
              aria-label={`${worldsInfo[world].name}世界を選択`}
              tabIndex={0}
              role="radio"
            >
              {worldsInfo[world].name}
            </button>
          ))}
        </div>
      </div>
    </>
  ), [currentWorld, worldType, worldsInfo, handleWorldSelect, handleKeyDown]);
  
  // タブモードのレンダリング関数（簡略化のため省略）
  const renderTabMode = useCallback(() => {
    return (
      <div className="world-navigation-tabs">
        <div className="world-tabs" role="tablist" aria-label="世界選択">
          {/* タブ実装 */}
          <span>Tab mode implementation</span>
        </div>
      </div>
    );
  }, [worldType, worldsInfo]);
  
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