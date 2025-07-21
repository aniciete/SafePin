// src/App.jsx
// src/App.jsx
import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SupabaseProvider } from './contexts/SupabaseContext';
import AuthGuard from './components/auth/AuthGuard';
import { Toaster } from './components/common/Toaster';
import MainLayout from './components/layout/MainLayout';

const HomePage = lazy(() => import('./pages/landing/HomePage'));
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const ReportPage = lazy(() => import('./pages/report/ReportPage'));
const TrackReportPage = lazy(() => import('./pages/report/TrackReportPage'));
const AuthorityDashboardPage = lazy(() => import('./pages/dashboard/authority/AuthorityDashboardPage'));
const AdminDashboardPage = lazy(() => import('./pages/dashboard/admin/AdminDashboardPage'));

const AppRoutes = () => {
  const { loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="/track" element={<TrackReportPage />} />
        </Route>
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
        <main>
          <AppRoutes />
        </main>
        <Toaster />
      </Router>
    </AuthProvider>
  </SupabaseProvider>
);

export default App;