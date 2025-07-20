// src/App.jsx
import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SupabaseProvider } from './contexts/SupabaseContext';
import { NotificationProvider } from './components/common/notification/NotificationProvider';
import { NotificationContainer } from './components/common/notification/NotificationContainer';
import AuthGuard from './components/auth/AuthGuard';

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
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/report" element={<ReportPage />} />
        <Route path="/track" element={<TrackReportPage />} />
        <Route path="/dashboard/authority/*" element={<AuthGuard role="authority"><AuthorityDashboardPage /></AuthGuard>} />
        <Route path="/dashboard/admin/*" element={<AuthGuard role="admin"><AdminDashboardPage /></AuthGuard>} />
      </Routes>
    </Suspense>
  );
};

const App = () => (
  <SupabaseProvider>
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <NotificationContainer />
          <AppRoutes />
        </Router>
      </NotificationProvider>
    </AuthProvider>
  </SupabaseProvider>
);

export default App;