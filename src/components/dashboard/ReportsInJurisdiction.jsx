import React, { useContext } from 'react';
import { ReportsContext } from '../../contexts/ReportsContext';

const ReportsInJurisdiction = () => {
  const { reports, loading, error } = useContext(ReportsContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="dashboard-widget">
      <h3>Reports in Jurisdiction</h3>
      <ul>
        {reports.map((report) => (
          <li key={report.id}>
            {report.incidentType} - {report.severity}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReportsInJurisdiction;