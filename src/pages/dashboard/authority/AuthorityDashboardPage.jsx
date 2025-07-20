import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../../components/layout/Sidebar';
import ReportsInJurisdiction from '../../../components/dashboard/ReportsInJurisdiction';
import PendingVerifications from '../../../components/dashboard/PendingVerifications';
import ResolvedIncidents from '../../../components/dashboard/ResolvedIncidents';
import ReportsProvider from '../../../contexts/ReportsProvider';
import { PATHS } from '../../../utils/pathUtils';
import { useAuth } from '../../../contexts/AuthContext';

const AuthorityDashboardPage = () => {
  const { logout } = useAuth();
  return (
    <ReportsProvider>
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <main style={{ flexGrow: 1, padding: '1rem' }}>
          <header>
            <h1>Authority Dashboard</h1>
            <nav>
              <Link to={PATHS.LANDING}>Home</Link>
              <button onClick={logout}>Logout</button>
            </nav>
          </header>
          <ReportsInJurisdiction />
          <PendingVerifications />
          <ResolvedIncidents />
        </main>
      </div>
    </ReportsProvider>
  );
};

export default AuthorityDashboardPage;