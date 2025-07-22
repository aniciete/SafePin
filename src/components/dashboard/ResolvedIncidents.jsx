import React, { useState, useEffect } from 'react';
import { supabase } from '../../config/supabase';
import DashboardWidgetSkeleton from './DashboardWidgetSkeleton';

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
    return <DashboardWidgetSkeleton />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="p-4 border rounded-lg bg-white dark:bg-neutral-800 dark:border-neutral-700">
      <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-neutral-100">Resolved Incidents</h3>
      <p className="text-3xl font-bold text-gray-900 dark:text-neutral-100">{reports.length}</p>
      <p className="text-sm text-gray-500 dark:text-neutral-400">Total incidents resolved</p>
    </div>
  );
};

export default ResolvedIncidents;