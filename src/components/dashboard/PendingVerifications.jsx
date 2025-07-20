import React, { useState, useEffect } from 'react';
import { supabase } from '../../config/supabase';

const PendingVerifications = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('status', 'pending_verification');

      if (error) {
        setError(error);
      } else {
        setReports(data);
      }
      setLoading(false);
    };

    fetchReports();
  }, []);

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
            {report.incidentType} -{' '}
            {new Date(report.created_at).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PendingVerifications;