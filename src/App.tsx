import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@aws-amplify/ui-react';

//theme
import { laboratoryTheme } from './theme/laboratoryTheme';

// Layouts
import { MainLayout } from './components/layout/MainLayout';
import { LaboratoryLayout } from './components/layout/LaboratoryLayout';
import { MaterialsLayout } from './components/layout/MaterialsLayout';
import { AuthLayout } from './components/layout/AuthLayout';
import { theme } from './theme';

// Pages
import { MainPage } from './pages/MainPage';

import { AboutPage } from './pages/niferche/AboutPage';
import { PhilosophyPage } from './pages/niferche/PhilosophyPage';

import { LaboratoryPage } from './pages/laboratory/LaboratoryPage';
import { MainStory } from './pages/laboratory/MainStory';
import { SideStory } from './pages/laboratory/SideStory';

import { CommonMaterials } from './pages/materials/CommonMaterials';
import { QuxeMaterials } from './pages/materials/QuxeMaterials';
import { HodemeiMaterials } from './pages/materials/HodemeiMaterials';
import { AlsarejiaMaterials } from './pages/materials/AlsarejiaMaterials';

import { GalleryPage } from './pages/gallery/GalleryPage';
import { RightsPage } from './pages/system/RightsPage';

import { NotFoundPage } from './pages/NotFoundPage';
import { ErrorPage } from './pages/ErrorPage';

import { SignInPage } from './pages/system/auth/SignInPage';
import { SignUpPage } from './pages/system/auth/SignUpPage';
import { ConfirmSignUpPage } from './pages/system/auth/ConfirmSignUpPage';

//components
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { AuthProvider } from './components/auth/AuthContext'; 

function App() {
  return (
  <BrowserRouter>
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <ErrorBoundary>
          <Routes>
            {/* Main layout routes */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<MainPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/niferche/philosophy" element={<PhilosophyPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/niferche/rights" element={<RightsPage />} />

              {/* Error routes */}
              <Route path="/error" element={<ErrorPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>

            {/* Laboratory layout routes */}
            <Route element={
              <ThemeProvider theme={laboratoryTheme}>
                <LaboratoryLayout />
              </ThemeProvider>
            }>
              <Route path="/laboratory/about" element={<LaboratoryPage />} />
              <Route path="/laboratory/mainstory" element={<MainStory />} />
              <Route path="/laboratory/sidestory" element={<SideStory />} />
            </Route>

            {/* Materials layout routes */}
            <Route element={<MaterialsLayout />}>
              <Route path="/materials/common" element={<CommonMaterials />} />
              <Route path="/materials/quxe" element={<QuxeMaterials />} />
              <Route path="/materials/hodemei" element={<HodemeiMaterials />} />
              <Route path="/materials/alsarejia" element={<AlsarejiaMaterials />} />
            </Route>

            {/* Auth layout routes */}
            <Route path="/auth/*" element={<AuthLayout />}>
              <Route path="signin" element={<SignInPage />} />
              <Route path="signup" element={<SignUpPage />} />
              <Route path="confirm" element={<ConfirmSignUpPage />} />
            </Route>
          </Routes>
        </ErrorBoundary>
      </ThemeProvider>
    </AuthProvider>
  </BrowserRouter>
  );
}

export default App;
