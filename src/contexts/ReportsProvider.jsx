import React, { useState, useCallback, useMemo } from 'react';
import { ReportsContext } from './ReportsContext';
import { getPaginatedReports } from '../services/report.service';

const ReportsProvider = ({ children }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    pageSize: 10,
    totalCount: 0,
  });
  const [filters, setFilters] = useState({});

  const fetchReports = useCallback(async (page, currentFilters) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error, count } = await getPaginatedReports(page, pagination.pageSize, currentFilters);
      if (error) throw error;

      setReports(data);
      const totalPages = Math.ceil(count / pagination.pageSize);
      setPagination(prev => ({
        ...prev,
        currentPage: page,
        totalCount: count,
        totalPages: totalPages,
      }));
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [pagination.pageSize]);

  const applyFilters = useCallback((newFilters) => {
    setFilters(newFilters);
    fetchReports(1, newFilters);
  }, [fetchReports]);

  const contextValue = useMemo(() => ({
    reports,
    loading,
    error,
    pagination,
    filters,
    fetchReports,
    applyFilters,
  }), [reports, loading, error, pagination, filters, fetchReports, applyFilters]);

  return (
    <ReportsContext.Provider value={contextValue}>
      {children}
    </ReportsContext.Provider>
  );
};

export default ReportsProvider;