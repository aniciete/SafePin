// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { SupabaseProvider } from './contexts/SupabaseContext';
import HomePage from './pages/landing/HomePage';
import LoginPage from './pages/auth/LoginPage';
import SignUpPage from './pages/auth/SignUpPage';
import ReportPage from './pages/report/ReportPage';
import AuthorityDashboardPage from './pages/dashboard/authority/AuthorityDashboardPage';
import AdminDashboardPage from './pages/dashboard/admin/AdminDashboardPage';
import AuthGuard from './components/auth/AuthGuard';

const App = () => (
  <SupabaseProvider>
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/report" element={<AuthGuard><ReportPage /></AuthGuard>} />
          <Route path="/dashboard/authority" element={<AuthGuard role="authority"><AuthorityDashboardPage /></AuthGuard>} />
          <Route path="/dashboard/admin" element={<AuthGuard role="admin"><AdminDashboardPage /></AuthGuard>} />
        </Routes>
      </Router>
    </AuthProvider>
  </SupabaseProvider>
);

export default App;