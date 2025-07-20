import React, { useState, useEffect } from 'react';
import { supabase } from '../../config/supabase';
import { useAuth } from '../../contexts/AuthContext';

const ReportsInJurisdiction = () => {
  const { profile } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!profile) return;

    const fetchReports = async () => {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('jurisdiction', profile.jurisdiction);

      if (error) {
        setError(error);
      } else {
        setReports(data);
      }
      setLoading(false);
    };

    fetchReports();
  }, [profile]);

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