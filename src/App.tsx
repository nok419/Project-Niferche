// src/App.tsx

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, Authenticator } from '@aws-amplify/ui-react';
import { SessionProvider } from './contexts/SessionContext';

// themes
import { laboratoryTheme } from './theme/laboratoryTheme';
import { theme } from './theme';

// Layouts
import { MainLayout } from './components/layout/MainLayout';
import { CallLayout } from './components/layout/CallLayout';
import { LibraryLayout } from './components/layout/LibraryLayout';
import { LaboratoryLayout } from './components/layout/LaboratoryLayout';
import { MaterialsRootLayout } from './components/layout/MaterialsRootLayout';
import { AuthLayout } from './components/layout/AuthLayout';

// Call Pages
import { AboutPage } from './pages/call/AboutPage';
import { PhilosophyPage } from './pages/call/PhilosophyPage';
import { NewsPage } from './pages/call/NewsPage';

// Library Pages
import { LibraryOverviewPage } from './pages/library/LibraryOverviewPage';
import { MainStory } from './pages/library/MainStory';
import { SideStory } from './pages/library/SideStory';
import { SideStoryListPage } from './pages/library/SideStoryListPage';
import { SideStoryDetailPage } from './pages/library/SideStoryDetailPage';
import { LibraryPage } from './pages/library/LibraryPage';
import { RecordsPage } from './pages/library/RecordsPage';

// Laboratory Pages
import { LaboratoryPage } from './pages/laboratory/LaboratoryPage';
import { ObservationPage } from './pages/laboratory/ObservationPage';
import { ArchivePage } from './pages/laboratory/ArchivePage';
import { GuidePage } from './pages/laboratory/GuidePage';
import { IdeaLibrary } from './pages/laboratory/IdeaLibrary';

// Materials Pages
import { MaterialsAbout } from './pages/materials/MaterialsAbout';
import { CommonSettings } from './pages/materials/CommonSettings';
import { QuxeMaterials } from './pages/materials/QuxeMaterials';
import { HodemeiMaterials } from './pages/materials/HodemeiMaterials';
import { AlsarejiaMaterials } from './pages/materials/AlsarejiaMaterials';

// Gallery Page
import { GalleryPage } from './pages/gallery/GalleryPage';

// System Pages
import { MainPage } from './pages/MainPage';
import { RightsPage } from './pages/system/RightsPage';
import { TermsPage } from './pages/system/TermsPage';
import { GuidelinesPage } from './pages/system/GuidelinesPage';

// Auth Pages
import { SignInPage } from './pages/system/auth/SignInPage';
import { SignUpPage } from './pages/system/auth/SignUpPage';
import { ConfirmSignUpPage } from './pages/system/auth/ConfirmSignUpPage';

// Error / 404
import { NotFoundPage } from './pages/NotFoundPage';
import { ErrorPage } from './pages/ErrorPage';

// Protected
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { ProfilePage } from './pages/user/ProfilePage';
import { FavoritesPage } from './pages/user/FavoritesPage';

import { ErrorBoundary } from './components/common/ErrorBoundary';

// ★ 新規追加ページ
import { GalleryDetailPage } from './pages/gallery/GalleryDetailPage';        // 追加
import { MaterialDetailPage } from './pages/materials/MaterialDetailPage';   // 追加
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';       // 追加

function App() {
  return (
    <Authenticator.Provider>
      <BrowserRouter>
        <SessionProvider>
          <ThemeProvider theme={theme}>
            <ErrorBoundary>
              <Routes>

                {/* Auth */}
                <Route path="/auth" element={<AuthLayout />}>
                  <Route path="signin" element={<SignInPage />} />
                  <Route path="signup" element={<SignUpPage />} />
                  <Route path="confirm" element={<ConfirmSignUpPage />} />
                </Route>

                {/* Call */}
                <Route element={<CallLayout />}>
                  <Route path="/call/about" element={<AboutPage />} />
                  <Route path="/call/philosophy" element={<PhilosophyPage />} />
                  <Route path="/call/news" element={<NewsPage />} />
                </Route>

                {/* Library */}
                <Route element={<LibraryLayout />}>
                  <Route path="/library" element={<LibraryOverviewPage />} />
                  <Route path="/library/mainstory" element={<MainStory />} />
                  <Route path="/library/sidestory" element={<SideStory />} />
                  <Route path="/library/sidestorylist" element={<SideStoryListPage />} />
                  <Route path="/library/sidestory/detail/:storyId" element={<SideStoryDetailPage />} />
                  <Route path="/library/records" element={<RecordsPage />} />
                  <Route path="/library/page" element={<LibraryPage />} />
                </Route>

                {/* Laboratory */}
                <Route
                  element={
                    <ThemeProvider theme={laboratoryTheme}>
                      <LaboratoryLayout />
                    </ThemeProvider>
                  }
                >
                  <Route path="/laboratory/about" element={<LaboratoryPage />} />
                  <Route path="/laboratory/observation" element={<ObservationPage />} />
                  <Route path="/laboratory/archive" element={<ArchivePage />} />
                  <Route path="/laboratory/guide" element={<GuidePage />} />
                  <Route path="/laboratory/ideas" element={<IdeaLibrary />} />
                </Route>

                {/* Materials */}
                <Route element={<MaterialsRootLayout />}>
                  <Route path="/materials/about" element={<MaterialsAbout />} />
                  <Route path="/materials/common" element={<CommonSettings />} />
                  <Route path="/materials/quxe" element={<QuxeMaterials />} />
                  <Route path="/materials/hodemei" element={<HodemeiMaterials />} />
                  <Route path="/materials/alsarejia" element={<AlsarejiaMaterials />} />
                  {/* ★ 新規追加の詳細ルート */}
                  <Route 
                    path="/materials/:attribution/:world/:materialId" 
                    element={<MaterialDetailPage />} 
                  />
                </Route>

                {/* Gallery */}
                <Route element={<MainLayout />}>
                  <Route path="/gallery" element={<GalleryPage />} />
                  {/* ★ 新規追加のギャラリ詳細ルート */}
                  <Route path="/gallery/view/:galleryId" element={<GalleryDetailPage />} />

                  <Route path="/rights" element={<RightsPage />} />
                  <Route path="/terms" element={<TermsPage />} />
                  <Route path="/guidelines" element={<GuidelinesPage />} />
                </Route>

                {/* Protected */}
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/favorites"
                  element={
                    <ProtectedRoute>
                      <FavoritesPage />
                    </ProtectedRoute>
                  }
                />
                {/* 管理者専用 */}
                <Route 
                  path="/admin"
                  element={
                    <ProtectedRoute accessLevel="admin">
                      <AdminDashboardPage />
                    </ProtectedRoute>
                  }
                />

                {/* メイン */}
                <Route path="/" element={<MainLayout />}>
                  <Route index element={<MainPage />} />
                </Route>

                {/* エラー */}
                <Route path="/error" element={<ErrorPage />} />
                <Route path="*" element={<NotFoundPage />} />

              </Routes>
            </ErrorBoundary>
          </ThemeProvider>
        </SessionProvider>
      </BrowserRouter>
    </Authenticator.Provider>
  );
}

export default App;
