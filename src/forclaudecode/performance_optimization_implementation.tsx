// src/forclaudecode/performance_optimization_implementation.tsx
import React, { lazy, Suspense, memo, useCallback, useMemo } from 'react';

/**
 * このファイルは Project Niferche の最適化実装例を示しています。
 * 各コンポーネントとパフォーマンス対策のサンプルコードがあります。
 */

/**
 * 1. React.memo を使用した最適化
 * 
 * 再レンダリングを防ぎ、パフォーマンスを向上させるには React.memo を使用します。
 * これは以下のように実装できます：
 */

// Before:
const NavigationItem = (props: { label: string; path: string }) => {
  return <li><a href={props.path}>{props.label}</a></li>;
};

// After:
const MemoizedNavigationItem = memo((props: { label: string; path: string }) => {
  return <li><a href={props.path}>{props.label}</a></li>;
});

/**
 * 2. コード分割と遅延ロード
 * 
 * React.lazy と Suspense を使用して、必要なときにだけコンポーネントをロードします：
 */

// Before:
// import HeavyComponent from './HeavyComponent';

// After:
const LazyHeavyComponent = lazy(() => import('./HeavyComponent'));

const LazyLoadExample = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyHeavyComponent />
    </Suspense>
  );
};

/**
 * 3. useMemo と useCallback の使用
 * 
 * 値や関数を再計算しないようにするには以下のパターンを使用します：
 */

// Before (without optimization):
const ExampleComponent = (props: { items: string[] }) => {
  const sortedItems = props.items.sort();
  
  const handleClick = () => {
    console.log('Item clicked');
  };
  
  return (
    <ul>
      {sortedItems.map(item => (
        <li key={item} onClick={handleClick}>{item}</li>
      ))}
    </ul>
  );
};

// After (with optimization):
const OptimizedComponent = memo((props: { items: string[] }) => {
  // ソートは props.items が変更されたときのみ実行
  const sortedItems = useMemo(() => {
    return [...props.items].sort();
  }, [props.items]);
  
  // 関数は再生成しない
  const handleClick = useCallback(() => {
    console.log('Item clicked');
  }, []);
  
  return (
    <ul>
      {sortedItems.map(item => (
        <li key={item} onClick={handleClick}>{item}</li>
      ))}
    </ul>
  );
});

/**
 * 4. 適用例: WordNavigation コンポーネントの最適化
 */

// 以下は WorldNavigation.tsx を最適化する方法の例です：

const worldsInfo = {
  hodemei: {
    // 複雑なデータ構造...
  }
};

// 重い計算のメモ化
const getWorldInfo = (worldType: string) => {
  // この関数は worldsInfo から世界情報を取得し、処理を行うとします
  return worldsInfo[worldType as keyof typeof worldsInfo];
};

// メモ化された関数として再実装
const useWorldInfo = (worldType: string) => {
  return useMemo(() => getWorldInfo(worldType), [worldType]);
};

/**
 * 5. イベントハンドラーの最適化
 */

const OptimizedEventHandling = () => {
  // イベント委任を使用して多数の子要素のイベントを効率的に処理
  const handleContainerClick = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'LI') {
      console.log('List item clicked:', target.textContent);
    }
  }, []);

  return (
    <ul onClick={handleContainerClick}>
      <li data-id="1">Item 1</li>
      <li data-id="2">Item 2</li>
      <li data-id="3">Item 3</li>
      {/* 多数の項目がある場合でも、ハンドラーは1つだけ */}
    </ul>
  );
};

/**
 * 6. リスト表示の最適化
 */

// 仮想スクロールやページネーションの実装例
const VirtualizedListExample = memo(() => {
  // 実際のアプリケーションでは、ライブラリを使用することが多い
  return (
    <div style={{ height: '200px', overflow: 'auto' }}>
      {/* 表示領域内の項目のみをレンダリング */}
      <div style={{ height: '1000px' }}>
        <div style={{ position: 'absolute', top: '50px' }}>Item 1</div>
        <div style={{ position: 'absolute', top: '80px' }}>Item 2</div>
        {/* 他の表示項目... */}
      </div>
    </div>
  );
});

/**
 * 7. 画像の最適化
 */

// 遅延読み込みと適切なサイズの画像
const OptimizedImage = memo(({ src, alt }: { src: string, alt: string }) => {
  return (
    <img 
      src={src} 
      alt={alt} 
      loading="lazy" 
      width="300" 
      height="200"
      onLoad={() => console.log('Image loaded')}
    />
  );
});

/**
 * 8. ThemeProvider の最適化例
 */

// 不要な再レンダリングを防ぎ、コンテキスト分割を実装
const OptimizedThemeProvider = ({ children }: { children: React.ReactNode }) => {
  // ダークモードと配色テーマを分離し、変更が必要な部分だけを再レンダリング
  return (
    <ColorThemeProvider>
      <DarkModeProvider>
        {children}
      </DarkModeProvider>
    </ColorThemeProvider>
  );
};

// ダミー実装
const ColorThemeProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>;
const DarkModeProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>;

/**
 * 9. useContent フックの最適化例
 */

// キャッシュの最適化とデータ取得のバッチ処理
const useOptimizedContent = () => {
  // APIコールのバッチ処理の実装例
  const batchGetContent = useCallback(async (ids: string[]) => {
    // 単一リクエストで複数のコンテンツを取得
    console.log(`Fetching ${ids.length} items in a single request`);
    return ids.map(id => ({ id, title: `Content ${id}` }));
  }, []);

  return { batchGetContent };
};

export {
  MemoizedNavigationItem,
  LazyLoadExample,
  OptimizedComponent,
  OptimizedEventHandling,
  VirtualizedListExample,
  OptimizedImage,
  OptimizedThemeProvider,
  useOptimizedContent
};