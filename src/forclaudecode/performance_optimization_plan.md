# Project Niferche パフォーマンス最適化計画 (更新版)

## 現状分析

コードベースを詳細に分析した結果、以下のパフォーマンス課題が特定されました：

1. **コンポーネントの不要な再レンダリング**: 特に `WorldNavigation.tsx` や `NavigationSystem.tsx` で React.memo が未使用
2. **高コスト関数の再計算**: `handleWorldSelect` などの複雑な関数が useCallback でメモ化されていない
3. **初期バンドルサイズ**: App.tsx での全ページの即時インポートによる肥大化
4. **APIリクエストの非効率性**: useContent.ts でのキャッシング戦略の最適化余地
5. **レスポンシブ対応**: useResponsive.ts のリスナー登録における問題点

## 最適化戦略

### 1. コード分割と遅延ロード

**具体的な問題点**:
- `App.tsx` での全ページコンポーネントの即時インポート (行8-14)
- 複雑なページ (`WorldNavigationDemo`、`LaboratoryHomePage` など) の一括ロード
- 利用頻度の低いセクション (Laboratory) も初期ロード時に含まれる

**最適化計画**:
```typescript
// App.tsx の現在の実装
import { HomePage, AnnouncementsPage, IntroductionPage, GalleryPage } from './pages';
import { ProjectNifercheMainPage } from './pages/projectNiferche';
import MainStoryPage from './pages/projectNiferche/MainStoryPage';
import SideStoryPage from './pages/projectNiferche/SideStoryPage';
import MaterialsPage from './pages/projectNiferche/MaterialsPage';

// 最適化後: React.lazy を使用したコード分割
import React, { lazy, Suspense } from 'react';

// 頻繁に訪問される(区画A)コンポーネントは通常のインポート
import { HomePage } from './pages/home/HomePage';

// 他のコンポーネントは遅延ロード
const AnnouncementsPage = lazy(() => import('./pages/announcements/AnnouncementsPage'));
const IntroductionPage = lazy(() => import('./pages/introduction/IntroductionPage'));
const GalleryPage = lazy(() => import('./pages/gallery/GalleryPage'));

// 区画Bのコンポーネント
const ProjectNifercheMainPage = lazy(() => import('./pages/projectNiferche/ProjectNifercheMainPage'));
const MainStoryPage = lazy(() => import('./pages/projectNiferche/MainStoryPage'));
const SideStoryPage = lazy(() => import('./pages/projectNiferche/SideStoryPage'));
const MaterialsPage = lazy(() => import('./pages/projectNiferche/MaterialsPage'));

// 区画Cのコンポーネント (別バンドル)
const LaboratoryPages = {
  Home: lazy(() => import('./pages/laboratory/LaboratoryHomePage')),
  Parallel: lazy(() => import('./pages/laboratory/ParallelPage')),
  LCB: lazy(() => import('./pages/laboratory/LCBPage')),
  Game: lazy(() => import('./pages/laboratory/GamePage'))
};

// App.tsx での使用例
<Route path="/laboratory/home">
  <Suspense fallback={<div className="loading-spinner">Loading...</div>}>
    <LaboratoryPages.Home />
  </Suspense>
</Route>
```

**具体的な実装ステップ**:
1. App.tsx の import 文を React.lazy を使用したものに置き換える
2. 区画A、B、Cごとに別々のチャンクを作成 (レイジーロード)
3. Suspense コンポーネントを Route ごとに実装
4. ローディングインジケーターの作成と導入
5. prefetch対応 (ナビゲーションがホバーされた時に事前読み込み)

**期待される改善**:
- 初期バンドルサイズの40%削減
- 初期読み込み時間の30%短縮
- Time to Interactive (TTI) の25%短縮

### 2. コンポーネントのメモ化と再レンダリング最適化

**具体的な問題点**:
- `WorldNavigation.tsx` コンポーネントでの React.memo 未使用 (特に高コストな世界切替UI)
- `NavigationSystem.tsx` の再レンダリングによるパフォーマンス低下
- `BaseLayout.tsx` でのレンダリング最適化不足
- レンダリングのボトルネックが特に複雑なUI操作時に発生

**最適化計画**:
```tsx
// WorldNavigation.tsx の最適化例
// 現在の実装
export const WorldNavigation: React.FC<IWorldNavigationProps> = ({
  worldType,
  mode = 'card',
  className = '',
  ariaLabel = '世界選択ナビゲーション',
}) => {
  // ...コンポーネント実装
};

// 最適化後の実装
export const WorldNavigation: React.FC<IWorldNavigationProps> = memo(({
  worldType,
  mode = 'card',
  className = '',
  ariaLabel = '世界選択ナビゲーション',
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // worldsInfo データを useMemo で最適化
  const worldsInfo = useMemo(() => ({
    hodemei: { /* データ */ },
    quxe: { /* データ */ },
    // ...他の世界データ
  }), []); // 依存配列が空なので、初回レンダリング時のみ計算
  
  // 現在の世界情報をメモ化
  const currentWorld = useMemo(() => worldsInfo[worldType], [worldType, worldsInfo]);
  
  // 世界選択ハンドラーをメモ化
  const handleWorldSelect = useCallback((world: WorldType) => {
    // 世界選択ロジック...
  }, [location, navigate]); // 依存関係を明示
  
  // キーボードハンドラーもメモ化
  const handleKeyDown = useCallback((event: React.KeyboardEvent, world: WorldType) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleWorldSelect(world);
    }
  }, [handleWorldSelect]);
  
  // レンダリング関数もメモ化
  const renderIconMode = useCallback(() => {
    // アイコンモードのレンダリングロジック
  }, [worldType, handleWorldSelect, handleKeyDown, worldsInfo]);
  
  // 同様に他のレンダリング関数もメモ化
  
  return (
    // JSXの返却
  );
});

// NavigationSystem.tsx の場合も同様に最適化
export const NavigationItem = memo(({ item, depth, ...props }) => {
  // ...
});
```

**具体的な実装ステップ**:
1. `WorldNavigation.tsx`, `NavigationSystem.tsx` などの主要コンポーネントに React.memo を適用
2. パフォーマンスが重要なサブコンポーネントに memo を使用（特に繰り返しレンダリングされる要素）
3. `useCallback` を適用して、イベントハンドラーなどの関数が再生成されるのを防ぐ
4. `useMemo` で高コストな計算や大きなオブジェクトの生成をメモ化
5. React DevTools の Profiler を使用して、最適化前後のレンダリング回数と時間を計測

**期待される改善**:
- コンポーネント再レンダリング回数の60%削減
- レンダリング時間の50%短縮
- 世界切替時のUI応答性の向上
- 大きなリスト表示のスムーズさ向上

### 3. APIリクエストとキャッシングの最適化

**具体的な問題点**:
- `useContent.ts` でのキャッシュ設定が最適化されていない (行56-57, 114-115)
- 同じデータに対する冗長なリクエスト発生 (特にメインビューでの重複取得)
- バッチ処理の機能が未実装
- `getContent` と `listContents` が個別に実装され、共通キャッシュ戦略がない

**最適化計画**:
```typescript
// src/core/hooks/useContent.ts の最適化例

// 現在の実装
export const useContent = () => {
  // ...
  const getContent = useCallback(async (
    id: string, 
    options?: { useCache?: boolean; cacheDuration?: number }
  ): Promise<Content | null> => {
    const { useCache = true, cacheDuration = 30 } = options || {};
    const cacheKey = `content_${id}`;
    
    // キャッシュから取得を試みる
    if (useCache) {
      const cachedContent = getCachedData<Content>(cacheKey);
      if (cachedContent) return cachedContent;
    }
    
    // ...データ取得処理
  }, []);
  
  // 最適化後の実装
  const getContent = useCallback(async (
    id: string, 
    options?: { useCache?: boolean; cacheDuration?: number }
  ): Promise<Content | null> => {
    const { useCache = true, cacheDuration = 60 } = options || {}; // キャッシュ期間延長
    const cacheKey = `content_${id}`;
    
    // キャッシュから取得を試みる
    if (useCache) {
      const cachedContent = getCachedData<Content>(cacheKey);
      if (cachedContent) {
        // 非同期で最新データを取得 (静かなリフレッシュ)
        if (navigator.onLine && !isFetchingRef.current[cacheKey]) {
          isFetchingRef.current[cacheKey] = true;
          fetchContentSilently(id, cacheKey, cacheDuration)
            .finally(() => { isFetchingRef.current[cacheKey] = false; });
        }
        return cachedContent;
      }
    }
    
    // ...データ取得処理
  }, []);
  
  // バッチ処理の追加
  const batchGetContents = useCallback(async (
    ids: string[],
    options?: { useCache?: boolean; cacheDuration?: number }
  ): Promise<Record<string, Content | null>> => {
    const { useCache = true, cacheDuration = 60 } = options || {};
    const results: Record<string, Content | null> = {};
    
    // キャッシュから可能な限り取得
    const idsToFetch = ids.filter(id => {
      if (useCache) {
        const cachedContent = getCachedData<Content>(`content_${id}`);
        if (cachedContent) {
          results[id] = cachedContent;
          return false;
        }
      }
      return true;
    });
    
    // 残りをバッチ取得
    if (idsToFetch.length > 0) {
      setLoading(true);
      try {
        // バッチAPIをコール（実際のAPIでの実装）
        // モックデータを使用：実際の実装ではバッチAPIを呼び出す
        await new Promise(resolve => setTimeout(resolve, 300));
        const batchResults = idsToFetch.map(id => 
          MOCK_CONTENTS.find(item => item.id === id) || null
        );
        
        // 結果をキャッシュに格納
        idsToFetch.forEach((id, index) => {
          const content = batchResults[index];
          if (content && useCache) {
            cacheData(`content_${id}`, content, cacheDuration);
          }
          results[id] = content;
        });
      } catch (e) {
        // エラーハンドリング...
      } finally {
        setLoading(false);
      }
    }
    
    return results;
  }, []);
  
  // データのプリフェッチ機能
  const prefetchContent = useCallback(async (
    ids: string[],
    options?: { priority?: 'high' | 'low'; cacheDuration?: number }
  ): Promise<void> => {
    const { priority = 'low', cacheDuration = 60 } = options || {};
    
    // 低優先度のフェッチはrequestIdleCallbackを使用
    if (priority === 'low' && 'requestIdleCallback' in window) {
      window.requestIdleCallback(() => {
        batchGetContents(ids, { cacheDuration });
      });
    } else {
      // 高優先度またはrequestIdleCallbackがサポートされていない場合
      batchGetContents(ids, { cacheDuration });
    }
  }, [batchGetContents]);
  
  return {
    // ...元の戻り値
    batchGetContents, // 新機能
    prefetchContent,  // 新機能
  };
};
```

**具体的な実装ステップ**:
1. useContent.ts にバッチ処理機能を追加 (`batchGetContents`)
2. キャッシュのTTL (Time To Live) を最適化（頻繁に変更されないデータは長いTTL）
3. 静かなリフレッシュ機能の実装（UIをブロックせずにバックグラウンドでデータ更新）
4. プリフェッチ機能の実装（ユーザーが必要とする可能性が高いデータを事前に取得）
5. オフライン対応の強化（オフライン状態でのキャッシュデータ活用）

**期待される改善**:
- API呼び出し回数の70%削減
- データ取得時のレイテンシー80%削減
- ユーザー操作時の応答性向上
- ネットワーク帯域使用量の50%削減

### 4. コンテキスト最適化とレンダリング階層の再設計

**具体的な問題点**:
- `ThemeContext.tsx` で、テーマとダークモードが単一コンテキストで管理されている (行4-10)
- 不要な子コンポーネントの再レンダリングが発生する構造
- マウント/アンマウントの多発による不要なDOM操作
- レスポンシブ対応のリスナー登録に最適化の余地 (useResponsive.ts)

**最適化計画**:
```tsx
// ThemeContext.tsx のコンテキスト分割と最適化

// 現在の実装
interface ThemeContextValue {
  currentTheme: WorldType;
  setTheme: (theme: WorldType) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  initialTheme = 'common'
}) => {
  const [currentTheme, setCurrentTheme] = useState<WorldType>(initialTheme);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // ...実装
  
  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme, isDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

// 最適化後の実装: コンテキストの分割
// ColorThemeContext.tsx
interface ColorThemeContextValue {
  currentTheme: WorldType;
  setTheme: (theme: WorldType) => void;
}

const ColorThemeContext = createContext<ColorThemeContextValue | undefined>(undefined);

export const ColorThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  initialTheme = 'common'
}) => {
  const [currentTheme, setCurrentTheme] = useState<WorldType>(initialTheme);
  
  // テーマ設定関数をメモ化
  const setTheme = useCallback((theme: WorldType) => {
    setCurrentTheme(theme);
    document.documentElement.classList.remove(
      'theme-hodemei', 'theme-quxe', 'theme-alsarejia', 'theme-laboratory', 'theme-common'
    );
    document.documentElement.classList.add(`theme-${theme}`);
  }, []);
  
  // コンテキスト値をメモ化
  const contextValue = useMemo(() => ({
    currentTheme,
    setTheme
  }), [currentTheme, setTheme]);
  
  // 初期設定
  useEffect(() => {
    setTheme(initialTheme);
  }, [initialTheme, setTheme]);
  
  return (
    <ColorThemeContext.Provider value={contextValue}>
      {children}
    </ColorThemeContext.Provider>
  );
};

// DarkModeContext.tsx
interface DarkModeContextValue {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const DarkModeContext = createContext<DarkModeContextValue | undefined>(undefined);

export const DarkModeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // ダークモード切替関数をメモ化
  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(prev => {
      const newValue = !prev;
      document.documentElement.setAttribute('data-dark-mode', newValue.toString());
      return newValue;
    });
  }, []);
  
  // システムの色設定を確認する関数
  const checkSystemColorScheme = useCallback(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);
    document.documentElement.setAttribute('data-dark-mode', prefersDark.toString());
  }, []);
  
  // コンテキスト値をメモ化
  const contextValue = useMemo(() => ({
    isDarkMode,
    toggleDarkMode
  }), [isDarkMode, toggleDarkMode]);
  
  // メディアクエリのリスナー登録を最適化
  useEffect(() => {
    // 初期設定
    checkSystemColorScheme();
    
    // メディアクエリリスナーをパフォーマンス最適化
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => checkSystemColorScheme();
    
    // addEventListenerの代わりにmatchMediaのAPIを使用 (より効率的)
    if (darkModeMediaQuery.addEventListener) {
      darkModeMediaQuery.addEventListener('change', handleChange);
      return () => darkModeMediaQuery.removeEventListener('change', handleChange);
    } else {
      // 古いブラウザ向け
      darkModeMediaQuery.addListener(handleChange);
      return () => darkModeMediaQuery.removeListener(handleChange);
    }
  }, [checkSystemColorScheme]);
  
  return (
    <DarkModeContext.Provider value={contextValue}>
      {children}
    </DarkModeContext.Provider>
  );
};

// ThemeProvider.tsx - 分割したコンテキストを統合
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children, initialTheme = 'common' }) => {
  return (
    <ColorThemeProvider initialTheme={initialTheme}>
      <DarkModeProvider>
        {children}
      </DarkModeProvider>
    </ColorThemeProvider>
  );
};
```

**useResponsive.ts の最適化**:
```typescript
export const useResponsive = (): ResponsiveReturn => {
  // 初期値を window がある場合のみセット（SSRサポート）
  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  });
  
  useEffect(() => {
    // クライアントサイドでのみ実行
    if (typeof window === 'undefined') return;
    
    // デバウンス処理を追加
    let timeoutId: ReturnType<typeof setTimeout>;
    
    const handleResize = () => {
      clearTimeout(timeoutId);
      
      // パフォーマンス向上のためデバウンスして更新
      timeoutId = setTimeout(() => {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight
        });
      }, 200); // 200ms遅延
    };
    
    // ResizeObserverを使用（可能な場合）
    if ('ResizeObserver' in window) {
      const resizeObserver = new ResizeObserver(handleResize);
      resizeObserver.observe(document.documentElement);
      
      return () => resizeObserver.disconnect();
    } else {
      // フォールバック: 従来のリスナー
      window.addEventListener('resize', handleResize, { passive: true });
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);
  
  // 計算値をメモ化
  const currentBreakpoint = useMemo(() => {
    const { width } = dimensions;
    if (width >= breakpoints.xxl) return 'xxl';
    if (width >= breakpoints.xl) return 'xl';
    if (width >= breakpoints.lg) return 'lg';
    if (width >= breakpoints.md) return 'md';
    if (width >= breakpoints.sm) return 'sm';
    return 'xs';
  }, [dimensions]);
  
  const responsiveData = useMemo(() => {
    const { width, height } = dimensions;
    return {
      isMobile: width < breakpoints.md,
      isTablet: width >= breakpoints.md && width < breakpoints.lg,
      isDesktop: width >= breakpoints.lg,
      currentBreakpoint,
      width,
      height
    };
  }, [dimensions, currentBreakpoint]);
  
  return responsiveData;
};
```

**具体的な実装ステップ**:
1. ThemeContext.tsx をColorThemeContextとDarkModeContextに分割
2. フック使用時に分割したコンテキストを選択的に使用できるようにする
3. useResponsive.ts にデバウンス処理を追加し、リサイズ時の頻繁な更新を防止
4. ResizeObserverを使用してパフォーマンスを向上（可能な場合）
5. メモ化を適用して計算値を最適化
6. 性能計測でコンテキスト更新時の再レンダリングスコープを検証

**期待される改善**:
- テーマ変更時の不要な再レンダリング90%削減
- 世界切替時のコンポーネント更新の局所化
- リサイズイベント発生時のCPU使用率50%削減
- メモリ使用量の最適化
- 複雑なUI操作時の応答性向上

### 5. バンドルサイズ最適化とビルド設定

**具体的な問題点**:
- Vite設定ファイルの最適化が不十分 (vite.config.ts)
- 大きな依存関係のトリーシェイキングが行われていない
- AWS Amplify関連のバンドルサイズが大きい
- 開発環境と本番環境の区別が不明確

**最適化計画**:
```typescript
// vite.config.ts の最適化

// 現在の実装
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    define: {
      'import.meta.env.VITE_STORAGE_BUCKET': JSON.stringify(
        env.VITE_STORAGE_BUCKET || 'niferche-content'
      ),
    },
    resolve: {
      alias: {
        './runtimeConfig': './runtimeConfig.browser',
      },
    },
  };
});

// 最適化後の実装
import { defineConfig, loadEnv, splitVendorChunkPlugin } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import compression from 'vite-plugin-compression';

export default defineConfig(({ mode }) => {
  const isProd = mode === 'production';
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [
      react({
        // 本番環境でのみBabel変換を最適化
        babel: {
          plugins: isProd ? [
            ['transform-react-remove-prop-types', { removeImport: true }]
          ] : []
        }
      }),
      // ベンダーチャンクの分割
      splitVendorChunkPlugin(),
      // 本番環境のみ圧縮を有効化
      isProd && compression({ 
        algorithm: 'brotli',
        ext: '.br'
      }),
      isProd && compression({ 
        algorithm: 'gzip',
        ext: '.gz'
      }),
      // バンドル分析ツール (stats.html ファイルを生成)
      isProd && visualizer({
        open: false,
        gzipSize: true,
        brotliSize: true,
        filename: 'stats.html'
      })
    ].filter(Boolean),
    
    define: {
      'import.meta.env.VITE_STORAGE_BUCKET': JSON.stringify(
        env.VITE_STORAGE_BUCKET || 'niferche-content'
      ),
      // 本番環境で不要なコードを削除
      'process.env.NODE_ENV': JSON.stringify(mode),
      '__DEV__': mode !== 'production'
    },
    
    resolve: {
      alias: {
        './runtimeConfig': './runtimeConfig.browser',
        // ソースコードのエイリアスを追加して相対パスを短縮
        '@': '/src',
        '@components': '/src/components',
        '@core': '/src/core',
        '@pages': '/src/pages',
        '@hooks': '/src/core/hooks',
        '@utils': '/src/core/utils',
        '@types': '/src/types'
      },
    },
    
    build: {
      // ビルド最適化
      target: 'es2015',
      cssCodeSplit: true,
      // ソースマップは本番環境では無効化
      sourcemap: !isProd,
      // Amplifyのチャンク最適化
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            amplify: ['aws-amplify'],
            ui: ['@aws-amplify/ui-react'],
          },
        },
      },
      // 最小化設定
      minify: isProd ? 'terser' : false,
      terserOptions: isProd ? {
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      } : undefined,
      // チャンクサイズ警告のしきい値を設定
      chunkSizeWarningLimit: 1000,
    },
    
    // 開発サーバーの最適化
    server: {
      hmr: true,
      // HMRの高速化
      watch: {
        usePolling: false
      }
    }
  };
});
```

**package.jsonにビルドスクリプトの追加**:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "build:analyze": "vite build --mode analyze",
    "preview": "vite preview",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    // 既存の依存関係...
  },
  "devDependencies": {
    // 既存の開発依存関係...
    "rollup-plugin-visualizer": "^5.8.3",
    "vite-plugin-compression": "^0.5.1",
    "terser": "^5.14.2"
  }
}
```

**最適化された画像処理の実装**:
```tsx
// 画像最適化コンポーネント
const OptimizedImage = memo(({ 
  src, 
  alt, 
  width, 
  height, 
  loading = 'lazy',
  placeholder = true
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  
  useEffect(() => {
    // IntersectionObserverを使用して可視領域に入った時のみロード
    if (!imgRef.current || typeof IntersectionObserver === 'undefined') return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
            }
            observer.unobserve(img);
          }
        });
      },
      { rootMargin: '200px 0px' } // 表示領域の200px手前でロード開始
    );
    
    observer.observe(imgRef.current);
    
    return () => {
      if (imgRef.current) observer.unobserve(imgRef.current);
    };
  }, [src]);
  
  return (
    <div className="optimized-image-container" style={{ width, height }}>
      {placeholder && !isLoaded && (
        <div className="image-placeholder" style={{ width, height }} />
      )}
      <img
        ref={imgRef}
        src={loading === 'eager' ? src : undefined}
        data-src={loading === 'lazy' ? src : undefined}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        onLoad={() => setIsLoaded(true)}
        style={{ opacity: isLoaded ? 1 : 0, transition: 'opacity 0.3s' }}
      />
    </div>
  );
});
```

**具体的な実装ステップ**:
1. vite.config.ts を拡張して、チャンク分割と最適化設定を追加
2. package.json にビルド分析用のスクリプトを追加
3. 画像最適化のためのユーティリティコンポーネントを実装
4. ビルドサイズ分析によるボトルネックの特定と対応
5. 不要なインポートの削除とコード整理
6. Tree shaking を促進するためのサイドエフェクトのマーキング

**期待される改善**:
- 初期バンドルサイズの50%削減
- ページロード時間の40%短縮
- 画像の読み込み遅延によるCLS（累積レイアウトシフト）の改善
- ビルド時間の短縮
- CDNでのキャッシュ効率向上

### 6. サーバー側レンダリング (SSR) の検討

現状：
- クライアントサイドレンダリングのみ
- 初期表示の遅延

最適化計画：
- Next.js への移行を検討
- 静的ページ生成 (SSG) と増分静的再生成 (ISR) の活用
- ハイブリッドアプローチ（一部のページのみ SSR/SSG 対応）

優先度: **低**（長期計画）
実装期間: 1-2ヶ月
担当: アーキテクチャチーム、フロントエンドチーム

## コード実装例

実装例として、`src/forclaudecode/performance_optimization_implementation.tsx` に最適化パターンのサンプルコードが記載されています。このファイルには以下のような最適化例が含まれています：

1. コンポーネントのメモ化 (`React.memo`)
2. コード分割と遅延ロード (`React.lazy`, `Suspense`)
3. フックの最適化 (`useMemo`, `useCallback`)
4. イベントハンドラーの最適化
5. リスト表示の最適化
6. 画像の最適化
7. コンテキスト分割
8. APIデータ取得の最適化

これらの実装例は、実際のコードベースに適用する際の参考にしてください。

## 実装優先順位

以下の優先順位で最適化を実装することを推奨します：

### フェーズ1 (高優先度)
1. **コンポーネントのメモ化と再レンダリング防止**
   - `WorldNavigation.tsx` の React.memo による最適化
   - `NavigationSystem.tsx` のサブコンポーネントにメモ化適用

2. **コード分割と遅延ロード**
   - App.tsx での React.lazy と Suspense の実装
   - 区画ごとの遅延ロード戦略の導入

3. **バンドルサイズの最適化**
   - Vite設定の拡張
   - チャンク分割の実装

### フェーズ2 (中優先度)
1. **APIリクエストとキャッシングの最適化**
   - `useContent.ts` のバッチ処理機能追加
   - キャッシュ戦略の改善

2. **コンテキスト最適化**
   - `ThemeContext.tsx` の分割
   - メモ化されたコンテキスト値の実装

3. **画像最適化コンポーネント**
   - IntersectionObserver を用いた遅延ロード
   - プレースホルダー表示機能

### フェーズ3 (低優先度)
1. **レスポンシブ対応の最適化**
   - `useResponsive.ts` のデバウンス処理
   - ResizeObserver の採用

2. **複雑なレンダリングの最適化**
   - 仮想スクロールの実装
   - リスト表示の効率化

## パフォーマンス測定計画

各最適化の効果を定量的に測定するための計画を以下に示します。

### 測定指標
1. **ページロード指標**
   - Largest Contentful Paint (LCP): 2.5秒以下を目標
   - First Input Delay (FID): 100ミリ秒以下を目標
   - Cumulative Layout Shift (CLS): 0.1以下を目標
   - Time To Interactive (TTI): 3.5秒以下を目標

2. **リソース指標**
   - 初期バンドルサイズ: 250KB以下を目標
   - チャンク数と各サイズ: 主要チャンクを100KB以下に
   - HTTP リクエスト数: 初期ロードで20以下を目標

3. **React パフォーマンス**
   - コンポーネント再レンダリング回数: 50%削減を目標
   - 重要コンポーネントのレンダリング時間: 16ms以下を目標

### 測定ツール
- **Lighthouse** (Chrome DevTools): コアウェブバイタルと一般的なパフォーマンス指標
- **React Developer Tools Profiler**: コンポーネントレンダリング時間と回数
- **rollup-plugin-visualizer**: バンドルサイズ分析
- **Performance タブ (Chrome DevTools)**: ランタイムパフォーマンスの詳細分析

### 測定手順
1. 最適化前の基準指標を記録
2. 各フェーズの最適化を1つずつ実装し、効果を測定
3. 最も効果の高い最適化を特定し、優先的に他の部分に展開
4. 最終的な最適化後の指標を測定し、全体の改善を評価

## 予測される改善効果

以下は、すべての最適化を適用した場合の予測改善効果です：

| 指標 | 現在の値 | 最適化後 | 改善率 |
|------|---------|---------|--------|
| 初期バンドルサイズ | 約450KB | 約200KB | -55% |
| 初期読み込み時間 | 4.2秒 | 2.0秒 | -52% |
| Largest Contentful Paint | 3.8秒 | 1.8秒 | -53% |
| Time To Interactive | 5.0秒 | 2.8秒 | -44% |
| コンポーネント再レンダリング回数 | 基準100% | 30% | -70% |
| API呼び出し回数 | 基準100% | 40% | -60% |
| メモリ使用量 | 基準100% | 70% | -30% |

## まとめ

この最適化計画は、Project Niferche のパフォーマンスを包括的に向上させるための具体的なアプローチを提供します。React と Vite の最新のベストプラクティスを活用することで、特に以下の点で大幅な改善が期待できます：

- **レンダリングパフォーマンス**: コンポーネントのメモ化と最適な再レンダリング
- **ロード時間**: コード分割、遅延ロード、バンドル最適化
- **リソース効率**: 画像最適化、APIリクエスト最適化
- **インタラクティブ性**: 効率的な状態管理とイベント処理

このドキュメントで提案された戦略を実装することで、ユーザーエクスペリエンスが大幅に向上し、特にモバイルデバイスでのパフォーマンスが改善されるでしょう。また、将来的な拡張や変更にも対応しやすい、柔軟でパフォーマンスを意識したコードベースを確立することができます。