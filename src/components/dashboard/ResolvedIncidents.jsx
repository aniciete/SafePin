import React, { useState, useEffect } from 'react';
import { supabase } from '../../config/supabase';

const ResolvedIncidents = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('status', 'resolved');

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
      <h3>Resolved Incidents</h3>
      <p>Total: {reports.length}</p>
    </div>
  );
};

export default ResolvedIncidents;