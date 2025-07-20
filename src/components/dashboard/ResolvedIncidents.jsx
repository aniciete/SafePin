import React, { useContext } from 'react';
import { ReportsContext } from '../../contexts/ReportsContext';

const ResolvedIncidents = () => {
  const { reports, loading, error } = useContext(ReportsContext);

  const resolvedReports = reports.filter(
    (report) => report.status === 'resolved'
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="dashboard-widget">
      <h3>Resolved Incidents</h3>
      <p>Total: {resolvedReports.length}</p>
    </div>
  );
};

export default ResolvedIncidents;