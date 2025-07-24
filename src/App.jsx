// src/App.jsx
import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useOutletContext as useReactRouterOutletContext } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SupabaseProvider } from './contexts/SupabaseContext';
import AuthGuard from './components/auth/AuthGuard';
import { Toaster } from '@/components/ui/toaster';
import MainLayout from './components/layout/MainLayout';
import EmergencyBanner from './components/layout/EmergencyBanner';

const HomePage = lazy(() => import('./pages/landing/HomePage'));
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const ReportPage = lazy(() => import('./pages/report/ReportPage'));
const TrackReportPage = lazy(() => import('./pages/report/TrackReportPage'));
// Correct the import to the new default export
const AuthorityDashboardPage = lazy(() => import('./pages/dashboard/authority/AuthorityDashboardPage'));
const AdminDashboardPage = lazy(() => import('./pages/dashboard/admin/AdminDashboardPage'));

// Footer pages
const AboutPage = lazy(() => import('./pages/about/AboutPage'));
const FAQPage = lazy(() => import('./pages/support/FAQPage'));
const ContactPage = lazy(() => import('./pages/support/ContactPage'));
const TermsPage = lazy(() => import('./pages/legal/TermsPage'));
const PrivacyPage = lazy(() => import('./pages/legal/PrivacyPage'));
const StatusPage = lazy(() => import('./pages/support/StatusPage'));
const UnsubscribePage = lazy(() => import('./pages/newsletter/UnsubscribePage'));

const AppRoutes = () => {
  const location = useLocation();
  const { loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  // Note: The `Suspense` fallback is now inside the CSSTransition,
  // which ensures it's part of the transition animation.
  return (
    <TransitionGroup component={null}>
      <CSSTransition key={location.key} classNames="page-fade" timeout={250}>
        <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading Page...</div>}>
          {/* The `location` prop is crucial for TransitionGroup to detect route changes */}
          <Routes location={location}>
            <Route element={<MainLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/report" element={<ReportPage />} />
              <Route path="/track" element={<TrackReportPage />} />
              
              {/* Footer pages */}
              <Route path="/about" element={<AboutPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/status" element={<StatusPage />} />
              <Route path="/unsubscribe" element={<UnsubscribePage />} />
            </Route>
            {/* The path must end with /* to allow nested routes */}
            <Route path="/dashboard/authority/*" element={
              <AuthGuard role="authority">
                <AuthorityDashboardPage />
              </AuthGuard>
            } />
            <Route path="/dashboard/admin/*" element={
              <AuthGuard role="admin">
                <AdminDashboardPage />
              </AuthGuard>
            } />
          </Routes>
        </Suspense>
      </CSSTransition>
    </TransitionGroup>
  );
};

const App = () => (
  <SupabaseProvider>
    <AuthProvider>
      <Router>
        <EmergencyBanner />
        <AppRoutes />
        <Toaster />
      </Router>
    </AuthProvider>
  </SupabaseProvider>
);

// Exporting this hook from here to avoid circular dependencies
export const useOutletContext = useReactRouterOutletContext;

export default App;