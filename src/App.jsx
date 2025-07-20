// src/App.jsx
import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { SupabaseProvider } from './contexts/SupabaseContext';
import { NotificationProvider } from './components/common/notification/NotificationProvider';
import { NotificationContainer } from './components/common/notification/NotificationContainer';
import AuthGuard from './components/auth/AuthGuard';

const HomePage = lazy(() => import('./pages/landing/HomePage'));
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const SignUpPage = lazy(() => import('./pages/auth/SignUpPage'));
const ReportPage = lazy(() => import('./pages/report/ReportPage'));
const AuthorityDashboardPage = lazy(() => import('./pages/dashboard/authority/AuthorityDashboardPage'));
const AdminDashboardPage = lazy(() => import('./pages/dashboard/admin/AdminDashboardPage'));

const App = () => (
  <SupabaseProvider>
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <NotificationContainer />
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/report" element={<AuthGuard><ReportPage /></AuthGuard>} />
              <Route path="/dashboard/authority" element={<AuthGuard role="authority"><AuthorityDashboardPage /></AuthGuard>} />
              <Route path="/dashboard/admin" element={<AuthGuard role="admin"><AdminDashboardPage /></AuthGuard>} />
            </Routes>
          </Suspense>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  </SupabaseProvider>
);

export default App;