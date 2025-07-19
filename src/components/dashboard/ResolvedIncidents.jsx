import React, { useEffect } from 'react';
import { useReports } from '../../hooks/useReports';

const ResolvedIncidents = () => {
  const { reports, loading, error, fetchResolvedReports } = useReports();

  useEffect(() => {
    fetchResolvedReports();
  }, [fetchResolvedReports]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="dashboard-widget">
      <h3>Resolved Incidents</h3>
      <p>Total: {reports.length}</p>
    </div>
  );
};

export default ResolvedIncidents;