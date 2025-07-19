import React from 'react';
import Sidebar from '../../../components/layout/Sidebar';
import ReportsInJurisdiction from '../../../components/dashboard/ReportsInJurisdiction';
import PendingVerifications from '../../../components/dashboard/PendingVerifications';
import ResolvedIncidents from '../../../components/dashboard/ResolvedIncidents';

const AuthorityDashboardPage = () => {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main style={{ flexGrow: 1, padding: '1rem' }}>
        <h1>Authority Dashboard</h1>
        <ReportsInJurisdiction />
        <PendingVerifications />
        <ResolvedIncidents />
      </main>
    </div>
  );
};

export default AuthorityDashboardPage;