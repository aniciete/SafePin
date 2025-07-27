import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SupabaseProvider } from './contexts/SupabaseContext';
import { ThemeProvider } from './contexts/ThemeProvider';
import AuthGuard from './components/auth/AuthGuard';
import { Toaster } from '@/components/ui/toaster';

// Import Layouts
import MainLayout from './components/layout/MainLayout';
import AuthLayout from './components/layout/AuthLayout';

// Lazy-loaded page components
const HomePage = lazy(() => import('./pages/landing/HomePage'));
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage'));
const UpdatePasswordPage = lazy(() => import('./pages/auth/UpdatePasswordPage'));
const ReportPage = lazy(() => import('./pages/report/ReportPage'));
const MyReportsPage = lazy(() => import('./pages/report/MyReportsPage')); // <-- RENAMED IMPORT
const AuthorityDashboardPage = lazy(() => import('./pages/dashboard/authority/AuthorityDashboardPage'));
const AdminDashboardPage = lazy(() => import('./pages/dashboard/admin/AdminDashboardPage'));
const AboutPage = lazy(() => import('./pages/about/AboutPage'));
const FAQPage = lazy(() => import('./pages/support/FAQPage'));
const ContactPage = lazy(() => import('./pages/support/ContactPage'));
const TermsPage = lazy(() => import('./pages/legal/TermsPage'));
const PrivacyPage = lazy(() => import('./pages/legal/PrivacyPage'));
const StatusPage = lazy(() => import('./pages/support/StatusPage'));
const UnsubscribePage = lazy(() => import('./pages/newsletter/UnsubscribePage'));


const AppRoutes = () => {
  const { loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center h-screen bg-background">Loading...</div>;
  }

  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen bg-background">Loading Page...</div>}>
      <Routes>
        {/* --- Layout for Public Pages --- */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="/my-reports" element={<MyReportsPage />} /> {/* <-- CORRECTED ROUTE */}
          <Route path="/about" element={<AboutPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/status" element={<StatusPage />} />
          <Route path="/unsubscribe" element={<UnsubscribePage />} />
        </Route>

        {/* --- Layout for Auth Pages --- */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/update-password" element={<UpdatePasswordPage />} />
        </Route>
        
        {/* --- Layouts for Secure Dashboards --- */}
        <Route 
          path="/dashboard/admin/*" 
          element={<AuthGuard role="admin"><AdminDashboardPage /></AuthGuard>} 
        />
        <Route 
          path="/dashboard/authority/*" 
          element={<AuthGuard role="authority"><AuthorityDashboardPage /></AuthGuard>} 
        />
      </Routes>
    </Suspense>
  );
};

const App = () => (
  <SupabaseProvider>
    <AuthProvider>
      <Router>
        <ThemeProvider defaultTheme="dark" storageKey="safepin-ui-theme">
          <AppRoutes />
          <Toaster />
        </ThemeProvider>
      </Router>
    </AuthProvider>
  </SupabaseProvider>
);

export default App;