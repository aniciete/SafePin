// src/App.jsx
import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useOutletContext as useReactRouterOutletContext } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SupabaseProvider } from './contexts/SupabaseContext';
import AuthGuard from './components/auth/AuthGuard';
import { Toaster } from '@/components/ui/toaster';
import MainLayout from './components/layout/MainLayout';

const HomePage = lazy(() => import('./pages/landing/HomePage'));
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const ReportPage = lazy(() => import('./pages/report/ReportPage'));
const TrackReportPage = lazy(() => import('./pages/report/TrackReportPage'));
// Correct the import to the new default export
const AuthorityDashboardPage = lazy(() => import('./pages/dashboard/authority/AuthorityDashboardPage'));
const AdminDashboardPage = lazy(() => import('./pages/dashboard/admin/AdminDashboardPage'));

const AppRoutes = () => {
  const { loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading Page...</div>}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="/track" element={<TrackReportPage />} />
        </Route>
        {/* The path must end with /* to allow nested routes */}
        <Route path="/dashboard/authority/*" element={<AuthGuard role="authority"><AuthorityDashboardPage /></AuthGuard>} />
        <Route path="/dashboard/admin/*" element={<AuthGuard role="admin"><AdminDashboardPage /></AuthGuard>} />
      </Routes>
    </Suspense>
  );
};

const App = () => (
  <SupabaseProvider>
    <AuthProvider>
      <Router>
        <AppRoutes />
        <Toaster />
      </Router>
    </AuthProvider>
  </SupabaseProvider>
);

// Exporting this hook from here to avoid circular dependencies
export const useOutletContext = useReactRouterOutletContext;

export default App;