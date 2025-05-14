// src/core/hooks/useResponsive.ts
import { useState, useEffect, useCallback, useMemo } from 'react';
import { breakpoints } from '../../types/common';

type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

interface ResponsiveReturn {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  currentBreakpoint: Breakpoint;
  width: number;
  height: number;
}

interface WindowDimensions {
  width: number;
  height: number;
}

/**
 * 関数をデバウンスするユーティリティ関数
 * @param func 実行する関数
 * @param wait 待機時間（ミリ秒）
 */
const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return (...args: Parameters<T>) => {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(later, wait);
  };
};

/**
 * レスポンシブデザインのためのフック
 * 現在の画面サイズとブレークポイントに関する情報を提供
 * @param debounceMs デバウンス時間（ミリ秒）
 */
export const useResponsive = (debounceMs = 200): ResponsiveReturn => {
  // 初期値を window がある場合のみセット（SSRサポート）
  const [dimensions, setDimensions] = useState<WindowDimensions>({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  });
  
  // リサイズハンドラーをメモ化して再作成を防止
  const handleResize = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }, []);
  
  // デバウンスされたリサイズハンドラーをメモ化
  const debouncedHandleResize = useMemo(
    () => debounce(handleResize, debounceMs),
    [handleResize, debounceMs]
  );
  
  useEffect(() => {
    // クライアントサイドでのみ実行
    if (typeof window === 'undefined') return;
    
    // 初期値をセット（SSRからクライアントに移行した時用）
    handleResize();
    
    // リサイズイベントのリスナーを追加
    window.addEventListener('resize', debouncedHandleResize);
    
    // コンポーネントのアンマウント時にリスナーを削除
    return () => {
      window.removeEventListener('resize', debouncedHandleResize);
    };
  }, [debouncedHandleResize, handleResize]);
  
  // 現在のブレークポイントを判定する関数をメモ化
  const getCurrentBreakpoint = useCallback((): Breakpoint => {
    const { width } = dimensions;
    
    if (width >= breakpoints.xxl) return 'xxl';
    if (width >= breakpoints.xl) return 'xl';
    if (width >= breakpoints.lg) return 'lg';
    if (width >= breakpoints.md) return 'md';
    if (width >= breakpoints.sm) return 'sm';
    return 'xs';
  }, [dimensions]);
  
  // 結果オブジェクトをメモ化して再計算を防止
  return useMemo(() => {
    const currentBreakpoint = getCurrentBreakpoint();
    const { width, height } = dimensions;
    
    return {
      isMobile: width < breakpoints.md,
      isTablet: width >= breakpoints.md && width < breakpoints.lg,
      isDesktop: width >= breakpoints.lg,
      currentBreakpoint,
      width,
      height
    };
  }, [dimensions, getCurrentBreakpoint]);
};