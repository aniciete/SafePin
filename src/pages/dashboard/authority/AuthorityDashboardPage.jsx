import React from 'react';
import { Link } from 'react-router-dom';
import ReportsInJurisdiction from '../../../components/dashboard/ReportsInJurisdiction';
import PendingVerifications from '../../../components/dashboard/PendingVerifications';
import ResolvedIncidents from '../../../components/dashboard/ResolvedIncidents';
import { PATHS } from '../../../utils/pathUtils';
import { useAuth } from '../../../contexts/AuthContext';
import DashboardLayout from '../../../components/layout/DashboardLayout';

const AuthorityDashboardPage = () => {
  const { logout } = useAuth();
  return (
    <DashboardLayout>
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
    </DashboardLayout>
  );
};

export default AuthorityDashboardPage;