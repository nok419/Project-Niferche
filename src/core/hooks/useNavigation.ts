// src/core/hooks/useNavigation.ts
import { useState, useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { WorldType } from '../../types/common';

export interface Breadcrumb {
  label: string;
  path: string;
}

export interface NavigationContextValue {
  currentPath: string;
  currentWorld: WorldType;
  navigate: (path: string) => void;
  breadcrumbs: Breadcrumb[];
  previousPath: string | null;
}

/**
 * パスからパンくずリストを生成するヘルパー関数
 */
const generateBreadcrumbs = (path: string): Breadcrumb[] => {
  // パスが '/' のみの場合は空の配列を返す
  if (path === '/') return [];

  // '/' で分割し、空の要素を除去
  const pathSegments = path.split('/').filter(segment => segment !== '');
  let currentPath = '';
  
  return pathSegments.map(segment => {
    currentPath += `/${segment}`;
    
    // セグメントからラベルを生成
    // 実際の実装では翻訳やマッピングを行う
    const label = segment
      // ハイフンやアンダースコアをスペースに変換
      .replace(/[-_]/g, ' ')
      // 単語の先頭を大文字に
      .replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1));
    
    return { label, path: currentPath };
  });
};

/**
 * 現在のパスから世界を判断するヘルパー関数
 */
export const getCurrentWorldFromPath = (path: string): WorldType => {
  if (path.includes('/laboratory')) return 'laboratory';
  if (path.includes('/hodemei')) return 'hodemei';
  if (path.includes('/quxe')) return 'quxe';
  if (path.includes('/alsarejia')) return 'alsarejia';
  
  // クエリパラメータの確認 (フック内で使う場合は location.search を使う)
  const queryWorld = path.includes('?') ? 
    new URLSearchParams(path.split('?')[1]).get('world') as WorldType : 
    null;
    
  if (queryWorld && ['hodemei', 'quxe', 'alsarejia'].includes(queryWorld)) {
    return queryWorld;
  }
  
  return 'common';
};

/**
 * ナビゲーション状態を管理するためのフック
 */
export const useNavigation = (): NavigationContextValue => {
  const location = useLocation();
  const navigate = useNavigate();
  const [previousPath, setPreviousPath] = useState<string | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);
  const [currentWorld, setCurrentWorld] = useState<WorldType>('common');
  
  // 現在のパス
  const currentPath = location.pathname;
  
  // パスとクエリパラメータが変わったら世界を更新
  useEffect(() => {
    const fullPath = `${currentPath}${location.search}`;
    const world = getCurrentWorldFromPath(fullPath);
    setCurrentWorld(world);
  }, [currentPath, location.search]);
  
  // パスが変わったらパンくずリストを更新
  useEffect(() => {
    // ホームを先頭に追加
    const newBreadcrumbs = [
      { label: 'Home', path: '/' },
      ...generateBreadcrumbs(currentPath)
    ];
    
    setBreadcrumbs(newBreadcrumbs);
    
    // 前のパスを記録（currentPathが変わるたび）
    if (currentPath !== previousPath && previousPath !== null) {
      setPreviousPath(previousPath);
    } else if (previousPath === null) {
      setPreviousPath(currentPath);
    }
  }, [currentPath, previousPath]);
  
  // ナビゲーション関数のメモ化
  const handleNavigate = useCallback((path: string) => {
    navigate(path);
  }, [navigate]);
  
  return {
    currentPath,
    currentWorld,
    navigate: handleNavigate,
    breadcrumbs,
    previousPath
  };
};