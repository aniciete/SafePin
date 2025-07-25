// src/App.jsx
import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useOutletContext as useReactRouterOutletContext } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SupabaseProvider } from './contexts/SupabaseContext';
import AuthGuard from './components/auth/AuthGuard';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from './contexts/ThemeProvider';
import MainLayout from './components/layout/MainLayout';
import EmergencyBanner from './components/layout/EmergencyBanner';

// Lazy-loaded page components
const HomePage = lazy(() => import('./pages/landing/HomePage'));
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const ReportPage = lazy(() => import('./pages/report/ReportPage'));
const TrackReportPage = lazy(() => import('./pages/report/TrackReportPage'));
const AuthorityDashboardPage = lazy(() => import('./pages/dashboard/authority/AuthorityDashboardPage'));
const AdminDashboardPage = lazy(() => import('./pages/dashboard/admin/AdminDashboardPage'));
const AboutPage = lazy(() => import('./pages/about/AboutPage'));
const FAQPage = lazy(() => import('./pages/support/FAQPage'));
const ContactPage = lazy(() => import('./pages/support/ContactPage'));
const TermsPage = lazy(() => import('./pages/legal/TermsPage'));
const PrivacyPage = lazy(() => import('./pages/legal/PrivacyPage'));
const StatusPage = lazy(() => import('./pages/support/StatusPage'));
const UnsubscribePage = lazy(() => import('./pages/newsletter/UnsubscribePage'));

// THIS IS THE FIX: AppRoutes is now defined at the top level, outside of App.
// This prevents it from being recreated on every render.
const AppRoutes = () => {
  const location = useLocation();
  const { loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading Page...</div>}>
      <Routes location={location}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="/track" element={<TrackReportPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/status" element={<StatusPage />} />
          <Route path="/unsubscribe" element={<UnsubscribePage />} />
        </Route>
        
        <Route 
          path="/dashboard/authority/*" 
          element={<AuthGuard role="authority"><AuthorityDashboardPage /></AuthGuard>} 
        />
        <Route 
          path="/dashboard/admin/*" 
          element={<AuthGuard role="admin"><AdminDashboardPage /></AuthGuard>} 
        />
      </Routes>
    </Suspense>
  );
};

const App = () => (
  <SupabaseProvider>
    <AuthProvider>
      <Router>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <AppRoutes />
          <Toaster />
        </ThemeProvider>
      </Router>
    </AuthProvider>
  </SupabaseProvider>
);

export const useOutletContext = useReactRouterOutletContext;

export default App;