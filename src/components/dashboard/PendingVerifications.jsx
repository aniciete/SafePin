import React, { useContext } from 'react';
import { ReportsContext } from '../../contexts/ReportsContext';

const PendingVerifications = () => {
  const { reports, loading, error } = useContext(ReportsContext);

  const pendingReports = reports.filter(
    (report) => report.status === 'pending_verification'
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="dashboard-widget">
      <h3>Pending Verifications</h3>
      <ul>
        {pendingReports.map((report) => (
          <li key={report.id}>
            {report.incidentType} -{' '}
            {new Date(report.created_at).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PendingVerifications;