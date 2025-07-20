import { useContext, useCallback } from 'react';
import { ReportsContext } from '../contexts/ReportsContext';

export const useReports = () => {
  const context = useContext(ReportsContext);
  if (context === undefined) {
    throw new Error('useReports must be used within a ReportsProvider');
  }

  const { pagination, filters, fetchReports, applyFilters } = context;

  const fetchNextPage = useCallback(() => {
    if (pagination.currentPage < pagination.totalPages) {
      fetchReports(pagination.currentPage + 1, filters);
    }
  }, [pagination, filters, fetchReports]);

  const fetchPrevPage = useCallback(() => {
    if (pagination.currentPage > 1) {
      fetchReports(pagination.currentPage - 1, filters);
    }
  }, [pagination, filters, fetchReports]);

  return {
    ...context,
    fetchNextPage,
    fetchPrevPage,
    applyFilters,
  };
};