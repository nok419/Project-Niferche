// src/App.tsx
import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './core/context/ThemeContext';
import { BaseLayout } from './layout/base/BaseLayout';
import { NavigationSystem } from './layout/navigation/NavigationSystem';

// ホームページは頻繁にアクセスされるので即時ロード
import { HomePage } from './pages';

// React.lazyを使用した遅延ロード
// 区画A: 基本ページ
const AnnouncementsPage = lazy(() => import('./pages/announcements/AnnouncementsPage'));
const IntroductionPage = lazy(() => import('./pages/introduction/IntroductionPage'));
const GalleryPage = lazy(() => import('./pages/gallery/GalleryPage'));

// 区画B: Project Niferche
const ProjectNifercheMainPage = lazy(() => import('./pages/projectNiferche/ProjectNifercheMainPage'));
const MainStoryPage = lazy(() => import('./pages/projectNiferche/MainStoryPage'));
const SideStoryPage = lazy(() => import('./pages/projectNiferche/SideStoryPage'));
const MaterialsPage = lazy(() => import('./pages/projectNiferche/MaterialsPage'));

// 区画C: Laboratory - 頻度の低いセクションなので個別にチャンク化
const LaboratoryPages = {
  Home: lazy(() => import('./pages/laboratory/LaboratoryHomePage')),
  Parallel: lazy(() => import('./pages/laboratory/ParallelPage')),
  LCB: lazy(() => import('./pages/laboratory/LCBPage')),
  Game: lazy(() => import('./pages/laboratory/GamePage'))
};

// デモページ
const WorldNavigationDemo = lazy(() => import('./pages/demo/WorldNavigationDemo'));

// 実装前の一時的なプレースホルダー
const ExperimentsPage = () => <div>実験室</div>;
const InteractivePage = () => <div>インタラクティブコンテンツ</div>;

// ローディングインジケーター
const LoadingFallback = () => (
  <div className="loading-container">
    <div className="loading-spinner"></div>
    <p>読み込み中...</p>
  </div>
);

// 404ページコンポーネント
const NotFoundPage = () => (
  <div className="container text-center">
    <h1>404</h1>
    <p>お探しのページは見つかりませんでした。</p>
  </div>
);

/**
 * 区画A用のナビゲーション項目
 */
const homeNavItems = [
  {
    id: 'home',
    label: 'ホーム',
    path: '/',
    icon: '🏠'
  },
  {
    id: 'announcements',
    label: 'お知らせ',
    path: '/announcements',
    icon: '📢'
  },
  {
    id: 'introduction',
    label: 'はじめに',
    path: '/introduction',
    icon: '📖'
  },
  {
    id: 'gallery',
    label: 'ギャラリー',
    path: '/gallery',
    icon: '🖼️'
  },
  {
    id: 'project-niferche',
    label: 'Project Niferche',
    path: '/project-niferche/top',
    icon: '🌍',
    children: [
      {
        id: 'main-story',
        label: 'メインストーリー',
        path: '/project-niferche/main-story'
      },
      {
        id: 'side-story',
        label: 'サイドストーリー',
        path: '/project-niferche/side-story'
      },
      {
        id: 'materials',
        label: '設定資料',
        path: '/project-niferche/materials'
      }
    ]
  },
  {
    id: 'laboratory',
    label: 'Laboratory',
    path: '/laboratory',
    icon: '🧪',
    highlight: true
  },
  {
    id: 'demo',
    label: 'デモ',
    path: '/demo',
    icon: '🔍',
    children: [
      {
        id: 'world-navigation-demo',
        label: '世界別ナビゲーション',
        path: '/demo/world-navigation'
      }
    ]
  }
];

/**
 * 区画B用のナビゲーション項目
 */
const projectNifercheNavItems = [
  {
    id: 'pn-top',
    label: 'Project Niferche',
    path: '/project-niferche/top',
    icon: '🏠'
  },
  {
    id: 'main-story',
    label: 'メインストーリー',
    path: '/project-niferche/main-story',
    icon: '📚',
    children: [
      {
        id: 'main-story-chapter-1',
        label: '序章: 始まりの鐘',
        path: '/project-niferche/main-story/chapter-1'
      },
      {
        id: 'main-story-chapter-2',
        label: '第一章: Hodemeiの夜明け',
        path: '/project-niferche/main-story/chapter-2'
      },
      {
        id: 'main-story-chapter-3',
        label: '第二章: Quxeの森の囁き (近日公開)',
        path: '/project-niferche/main-story/chapter-3',
        disabled: true
      }
    ]
  },
  {
    id: 'side-story',
    label: 'サイドストーリー',
    path: '/project-niferche/side-story',
    icon: '📖'
  },
  {
    id: 'materials',
    label: '設定資料',
    path: '/project-niferche/materials',
    icon: '🗺️',
    children: [
      {
        id: 'materials-hodemei',
        label: 'Hodemei',
        path: '/project-niferche/materials/world/hodemei'
      },
      {
        id: 'materials-quxe',
        label: 'Quxe',
        path: '/project-niferche/materials/world/quxe'
      },
      {
        id: 'materials-alsarejia',
        label: 'Alsarejia',
        path: '/project-niferche/materials/world/alsarejia'
      }
    ]
  },
  {
    id: 'characters',
    label: '登場人物',
    path: '/project-niferche/characters',
    icon: '👥'
  },
  {
    id: 'glossary',
    label: '用語集',
    path: '/project-niferche/glossary',
    icon: '📝'
  }
];

/**
 * 区画C（Laboratory）用のナビゲーション項目
 */
const laboratoryNavItems = [
  {
    id: 'lab-home',
    label: 'ラボラトリーホーム',
    path: '/laboratory/home',
    icon: '🏠'
  },
  {
    id: 'lab-parallel',
    label: 'Parallel',
    path: '/laboratory/parallel',
    icon: '🔄',
    children: [
      {
        id: 'lab-parallel-stories',
        label: 'パラレルストーリー',
        path: '/laboratory/parallel/stories'
      },
      {
        id: 'lab-parallel-worlds',
        label: 'パラレルワールド',
        path: '/laboratory/parallel/worlds'
      }
    ]
  },
  {
    id: 'lab-lcb',
    label: 'LCB',
    path: '/laboratory/lcb',
    icon: '🏛️',
    children: [
      {
        id: 'lab-lcb-project',
        label: 'プロジェクト概要',
        path: '/laboratory/lcb/project'
      },
      {
        id: 'lab-lcb-worldbuilding',
        label: '世界観構築',
        path: '/laboratory/lcb/worldbuilding'
      }
    ]
  },
  {
    id: 'lab-experiments',
    label: '実験',
    path: '/laboratory/experiments',
    icon: '🧪',
    children: [
      {
        id: 'lab-experiments-game',
        label: '2Dアドベンチャー',
        path: '/laboratory/experiments/game'
      },
      {
        id: 'lab-experiments-interactive',
        label: 'インタラクティブ',
        path: '/laboratory/experiments/interactive'
      }
    ]
  },
  {
    id: 'back-to-main',
    label: 'メインサイトに戻る',
    path: '/',
    icon: '🔙'
  }
];

/**
 * デモ用のナビゲーション項目
 */
const demoNavItems = [
  {
    id: 'demo-home',
    label: 'デモホーム',
    path: '/demo',
    icon: '🏠'
  },
  {
    id: 'world-navigation-demo',
    label: '世界別ナビゲーション',
    path: '/demo/world-navigation',
    icon: '🧭'
  },
  {
    id: 'back-to-home',
    label: 'メインサイトに戻る',
    path: '/',
    icon: '🔙'
  }
];

/**
 * アプリケーションのルートコンポーネント
 */
const App: React.FC = () => {
  // サイドバーコンテンツのレンダリング
  const renderSidebar = (navItems = homeNavItems) => (
    <NavigationSystem
      items={navItems}
      variant="sidebar"
      orientation="vertical"
      collapsible={true}
      depth={2}
    />
  );

  // ヘッダーコンテンツのレンダリング
  const renderHeader = (navItems = homeNavItems, title = "Project Niferche") => (
    <div className="container">
      <div className="flex justify-between items-center p-3">
        <div className="text-lg font-bold">{title}</div>
        <NavigationSystem
          items={navItems.filter(item => !item.children).slice(0, 5)}
          variant="tabs"
          orientation="horizontal"
          depth={1}
        />
      </div>
    </div>
  );

  return (
    <BrowserRouter>
      <ThemeProvider initialTheme="common">
        <Routes>
          {/* 区画A: Home */}
          <Route 
            path="/" 
            element={
              <BaseLayout
                headerContent={renderHeader(homeNavItems)}
                sidebarContent={renderSidebar(homeNavItems)}
                showBreadcrumbs={true}
                showFooter={true}
              />
            } 
          >
            <Route index element={<HomePage />} />
            <Route path="announcements" element={
              <Suspense fallback={<LoadingFallback />}>
                <AnnouncementsPage />
              </Suspense>
            } />
            <Route path="introduction" element={
              <Suspense fallback={<LoadingFallback />}>
                <IntroductionPage />
              </Suspense>
            } />
            <Route path="gallery" element={
              <Suspense fallback={<LoadingFallback />}>
                <GalleryPage />
              </Suspense>
            } />
          </Route>
          
          {/* 区画B: Project Niferche */}
          <Route 
            path="/project-niferche/*" 
            element={
              <BaseLayout
                headerContent={renderHeader(projectNifercheNavItems, "Project Niferche")}
                sidebarContent={renderSidebar(projectNifercheNavItems)}
                showBreadcrumbs={true}
                showFooter={true}
              />
            }
          >
            <Route index element={<Navigate to="/project-niferche/top" replace />} />
            <Route path="top" element={
              <Suspense fallback={<LoadingFallback />}>
                <ProjectNifercheMainPage />
              </Suspense>
            } />
            <Route path="main-story" element={
              <Suspense fallback={<LoadingFallback />}>
                <MainStoryPage />
              </Suspense>
            } />
            <Route path="main-story/:chapterId" element={
              <Suspense fallback={<LoadingFallback />}>
                <MainStoryPage />
              </Suspense>
            } />
            <Route path="side-story" element={
              <Suspense fallback={<LoadingFallback />}>
                <SideStoryPage />
              </Suspense>
            } />
            <Route path="side-story/:storyId" element={
              <Suspense fallback={<LoadingFallback />}>
                <SideStoryPage />
              </Suspense>
            } />
            <Route path="materials" element={
              <Suspense fallback={<LoadingFallback />}>
                <MaterialsPage />
              </Suspense>
            } />
            <Route path="materials/:materialId" element={
              <Suspense fallback={<LoadingFallback />}>
                <MaterialsPage />
              </Suspense>
            } />
            <Route path="materials/world/:worldId" element={
              <Suspense fallback={<LoadingFallback />}>
                <MaterialsPage />
              </Suspense>
            } />
          </Route>
          
          {/* 区画C: Laboratory */}
          <Route 
            path="/laboratory/*" 
            element={
              <BaseLayout
                headerContent={renderHeader(laboratoryNavItems, "Laboratory")}
                sidebarContent={renderSidebar(laboratoryNavItems)}
                showBreadcrumbs={true}
                showFooter={true}
              />
            } 
          >
            <Route index element={<Navigate to="/laboratory/home" replace />} />
            <Route path="home" element={
              <Suspense fallback={<LoadingFallback />}>
                <LaboratoryPages.Home />
              </Suspense>
            } />
            <Route path="parallel" element={
              <Suspense fallback={<LoadingFallback />}>
                <LaboratoryPages.Parallel />
              </Suspense>
            } />
            <Route path="parallel/:section" element={
              <Suspense fallback={<LoadingFallback />}>
                <LaboratoryPages.Parallel />
              </Suspense>
            } />
            <Route path="lcb" element={
              <Suspense fallback={<LoadingFallback />}>
                <LaboratoryPages.LCB />
              </Suspense>
            } />
            <Route path="lcb/:section" element={
              <Suspense fallback={<LoadingFallback />}>
                <LaboratoryPages.LCB />
              </Suspense>
            } />
            <Route path="experiments" element={<ExperimentsPage />} />
            <Route path="experiments/game" element={
              <Suspense fallback={<LoadingFallback />}>
                <LaboratoryPages.Game />
              </Suspense>
            } />
            <Route path="experiments/interactive" element={<InteractivePage />} />
          </Route>
          
          {/* デモページ */}
          <Route 
            path="/demo" 
            element={
              <BaseLayout
                headerContent={renderHeader(demoNavItems, "デモページ")}
                sidebarContent={renderSidebar(demoNavItems)}
                showBreadcrumbs={true}
                showFooter={true}
              />
            }
          >
            <Route index element={<Navigate to="/demo/world-navigation" replace />} />
            <Route path="world-navigation" element={
              <Suspense fallback={<LoadingFallback />}>
                <WorldNavigationDemo />
              </Suspense>
            } />
          </Route>
          
          {/* 404ページ */}
          <Route path="*" element={
            <BaseLayout showFooter={true}>
              <NotFoundPage />
            </BaseLayout>
          } />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;