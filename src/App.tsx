import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@aws-amplify/ui-react';

// themes
import { laboratoryTheme } from './theme/laboratoryTheme';
import { theme } from './theme';

// Layouts
import { MainLayout } from './components/layout/MainLayout';
import { CallLayout } from './components/layout/CallLayout';
import { LibraryLayout } from './components/layout/LibraryLayout';
import { LaboratoryLayout } from './components/layout/LaboratoryLayout';
import { MaterialsLayout } from './components/layout/MaterialsLayout';
import { AuthLayout } from './components/layout/AuthLayout';

// Call Pages
import { AboutPage } from './pages/call/AboutPage';
import { PhilosophyPage } from './pages/call/PhilosophyPage';
import { NewsPage } from './pages/call/NewsPage';

// Library Pages
import { LibraryOverviewPage } from './pages/library/LibraryOverviewPage';
import { MainStory } from './pages/library/MainStory';
import { SideStory } from './pages/library/SideStory';

// Laboratory Pages
import { LaboratoryPage } from './pages/laboratory/LaboratoryPage';
import { ObservationPage } from './pages/laboratory/ObservationPage';
import { ArchivePage } from './pages/laboratory/ArchivePage';
import { GuidePage } from './pages/laboratory/GuidePage';

// Materials Pages
import { MaterialsAbout } from './pages/materials/MaterialsAbout';
import { CommonSettings } from './pages/materials/CommonSettings';
import { QuxeMaterials } from './pages/materials/QuxeMaterials';
import { HodemeiMaterials } from './pages/materials/HodemeiMaterials';
import { AlsarejiaMaterials } from './pages/materials/AlsarejiaMaterials';

// Gallery Pages
import { GalleryPage } from './pages/gallery/GalleryPage';

// System Pages
import { RightsPage } from './pages/system/RightsPage';
import { SignInPage } from './pages/system/auth/SignInPage';
import { SignUpPage } from './pages/system/auth/SignUpPage';
import { ConfirmSignUpPage } from './pages/system/auth/ConfirmSignUpPage';

// Error Pages
import { NotFoundPage } from './pages/NotFoundPage';
import { ErrorPage } from './pages/ErrorPage';

// Components
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { AuthProvider } from './components/auth/AuthContext';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <ErrorBoundary>
            <Routes>
              {/* Call Section */}
              <Route element={<CallLayout />}>
                <Route path="/call/about" element={<AboutPage />} />
                <Route path="/call/philosophy" element={<PhilosophyPage />} />
                <Route path="/call/news" element={<NewsPage />} />
              </Route>

              {/* Library Section */}
              <Route element={<LibraryLayout />}>
                <Route path="/library" element={<LibraryOverviewPage />} />
                <Route path="/library/mainstory" element={<MainStory />} />
                <Route path="/library/sidestory" element={<SideStory />} />
              </Route>

              {/* Laboratory Section */}
              <Route element={
                <ThemeProvider theme={laboratoryTheme}>
                  <LaboratoryLayout />
                </ThemeProvider>
              }>
                <Route path="/laboratory" element={<LaboratoryPage />} />
                <Route path="/laboratory/observation" element={<ObservationPage />} />
                <Route path="/laboratory/archive" element={<ArchivePage />} />
                <Route path="/laboratory/guide" element={<GuidePage />} />
              </Route>

              {/* Materials Section */}
              <Route element={<MaterialsLayout />}>
                <Route path="/materials/about" element={<MaterialsAbout />} />
                <Route path="/materials/common" element={<CommonSettings />} />
                <Route path="/materials/quxe" element={<QuxeMaterials />} />
                <Route path="/materials/hodemei" element={<HodemeiMaterials />} />
                <Route path="/materials/alsarejia" element={<AlsarejiaMaterials />} />
              </Route>

              {/* Gallery Section */}
              <Route element={<MainLayout />}>
                <Route path="/gallery" element={<GalleryPage />} />
                <Route path="/rights" element={<RightsPage />} />
              </Route>

              {/* Auth Section */}
              <Route path="/auth/*" element={<AuthLayout />}>
                <Route path="signin" element={<SignInPage />} />
                <Route path="signup" element={<SignUpPage />} />
                <Route path="confirm" element={<ConfirmSignUpPage />} />
              </Route>

              {/* Error Routes */}
              <Route path="/error" element={<ErrorPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </ErrorBoundary>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;