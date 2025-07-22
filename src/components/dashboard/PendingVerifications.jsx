import React, { useState, useEffect } from 'react';
import { supabase } from '../../config/supabase';
import DashboardWidgetSkeleton from './DashboardWidgetSkeleton';

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
    return <DashboardWidgetSkeleton />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="p-4 border rounded-lg bg-surface bg-neutral-800 border-neutral-700">
      <h3 className="font-semibold text-lg mb-2 text-gray-900 text-neutral-100">Pending Verifications</h3>
      {reports.length > 0 ? (
        <ul className="space-y-2">
          {reports.map((report) => (
            <li key={report.id} className="text-sm text-gray-700 text-neutral-300">
              <span className="font-medium">{report.incident_type}</span> - <span className="text-xs">{new Date(report.created_at).toLocaleDateString()}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500 text-neutral-400">No reports pending verification.</p>
      )}
    </div>
  );
};

export default PendingVerifications;