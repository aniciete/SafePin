import React, { useState, useMemo, useEffect } from 'react';
import { ReportsContext } from './ReportsContext';
import { getReports } from '../services/report.service';

const ReportsProvider = ({ children }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadReports = async () => {
      try {
        setLoading(true);
        const data = await getReports();
        setReports(data);
      } catch (err) {
        setError(err);
        console.error('Failed to load reports:', err);
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, []);

  const contextValue = useMemo(() => ({
    reports,
    loading,
    error,
  }), [reports, loading, error]);

  return (
    <ReportsContext.Provider value={contextValue}>
      {children}
    </ReportsContext.Provider>
  );
};

export default ReportsProvider;