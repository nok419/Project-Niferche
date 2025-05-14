// src/core/context/ThemeContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { WorldType } from '../../types/common';

// 現在のテーマに関するコンテキスト
interface ThemeColorContextValue {
  currentTheme: WorldType;
  setTheme: (theme: WorldType) => void;
}

// ダークモードに関するコンテキスト
interface DarkModeContextValue {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

// 両方のコンテキストを結合したインターフェース
interface ThemeContextValue extends ThemeColorContextValue, DarkModeContextValue {}

// 分割されたコンテキスト
const ThemeColorContext = createContext<ThemeColorContextValue | undefined>(undefined);
const DarkModeContext = createContext<DarkModeContextValue | undefined>(undefined);
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  initialTheme?: WorldType;
}

/**
 * テーマカラープロバイダー - テーマの色に関する状態のみを管理
 */
export const ThemeColorProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  initialTheme = 'common'
}) => {
  const [currentTheme, setCurrentTheme] = useState<WorldType>(initialTheme);
  
  // テーマを設定する関数 - useCallbackでメモ化
  const setTheme = useCallback((theme: WorldType) => {
    setCurrentTheme(theme);
    
    // テーマクラスの一括変更 - パフォーマンス向上のため一度に操作
    const htmlElement = document.documentElement;
    const themeClasses = ['theme-hodemei', 'theme-quxe', 'theme-alsarejia', 'theme-laboratory', 'theme-common'];
    
    // クラスの一括削除
    htmlElement.classList.remove(...themeClasses);
    
    // 新しいテーマクラスを追加
    htmlElement.classList.add(`theme-${theme}`);
  }, []);
  
  // 初期設定
  useEffect(() => {
    // 初期テーマを適用
    setTheme(currentTheme);
  }, []);
  
  // コンテキスト値をメモ化
  const contextValue = useMemo(() => ({
    currentTheme,
    setTheme
  }), [currentTheme, setTheme]);
  
  return (
    <ThemeColorContext.Provider value={contextValue}>
      {children}
    </ThemeColorContext.Provider>
  );
};

/**
 * ダークモードプロバイダー - ダークモードの状態のみを管理
 */
export const DarkModeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // ダークモードを切り替える関数 - useCallbackでメモ化
  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(prevMode => {
      const newMode = !prevMode;
      document.documentElement.setAttribute('data-dark-mode', newMode.toString());
      return newMode;
    });
  }, []);
  
  // 初期設定
  useEffect(() => {
    // システムの色設定を確認
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);
    document.documentElement.setAttribute('data-dark-mode', prefersDark.toString());
    
    // ダークモード設定の変更を監視
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleDarkModeChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
      document.documentElement.setAttribute('data-dark-mode', e.matches.toString());
    };
    
    darkModeMediaQuery.addEventListener('change', handleDarkModeChange);
    
    return () => {
      darkModeMediaQuery.removeEventListener('change', handleDarkModeChange);
    };
  }, []);
  
  // コンテキスト値をメモ化
  const contextValue = useMemo(() => ({
    isDarkMode,
    toggleDarkMode
  }), [isDarkMode, toggleDarkMode]);
  
  return (
    <DarkModeContext.Provider value={contextValue}>
      {children}
    </DarkModeContext.Provider>
  );
};

/**
 * 結合されたThemeProviderコンポーネント - 下位互換性のために提供
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  initialTheme = 'common'
}) => {
  return (
    <ThemeColorProvider initialTheme={initialTheme}>
      <DarkModeProvider>
        <CombinedThemeProvider>
          {children}
        </CombinedThemeProvider>
      </DarkModeProvider>
    </ThemeColorProvider>
  );
};

/**
 * 両方のコンテキストを結合するプロバイダー
 */
const CombinedThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const themeColorContext = useContext(ThemeColorContext);
  const darkModeContext = useContext(DarkModeContext);
  
  if (!themeColorContext || !darkModeContext) {
    throw new Error('CombinedThemeProvider must be used within ThemeColorProvider and DarkModeProvider');
  }
  
  // 結合されたコンテキスト値をメモ化
  const combinedValue = useMemo(() => ({
    ...themeColorContext,
    ...darkModeContext
  }), [themeColorContext, darkModeContext]);
  
  return (
    <ThemeContext.Provider value={combinedValue}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * カラーテーマのみを使用するためのカスタムフック
 */
export const useThemeColor = (): ThemeColorContextValue => {
  const context = useContext(ThemeColorContext);
  if (context === undefined) {
    throw new Error('useThemeColor must be used within a ThemeColorProvider');
  }
  return context;
};

/**
 * ダークモードのみを使用するためのカスタムフック
 */
export const useDarkMode = (): DarkModeContextValue => {
  const context = useContext(DarkModeContext);
  if (context === undefined) {
    throw new Error('useDarkMode must be used within a DarkModeProvider');
  }
  return context;
};

/**
 * 完全なテーマコンテキストを使用するためのカスタムフック（以前と互換性あり）
 */
export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};