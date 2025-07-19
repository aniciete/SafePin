import React, { useEffect } from 'react';
import { useReports } from '../../hooks/useReports';

const PendingVerifications = () => {
  const {
    reports,
    loading,
    error,
    fetchPendingVerificationReports,
  } = useReports();

  useEffect(() => {
    fetchPendingVerificationReports();
  }, [fetchPendingVerificationReports]);

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
        {reports.map((report) => (
          <li key={report.id}>
            {report.incidentType} - {new Date(report.created_at).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PendingVerifications;