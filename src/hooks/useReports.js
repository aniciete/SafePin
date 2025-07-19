import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../config/supabase';

export const useReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReports = useCallback(async (status = null) => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase.from('reports').select('*');
      if (status) {
        query = query.eq('status', status);
      }
      const { data, error } = await query;
      if (error) {
        throw error;
      }
      setReports(data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const fetchPendingVerificationReports = useCallback(async () => {
    await fetchReports('pending_verification');
  }, [fetchReports]);

  const fetchResolvedReports = useCallback(async () => {
    await fetchReports('resolved');
  }, [fetchReports]);

  return {
    reports,
    loading,
    error,
    fetchReports,
    fetchPendingVerificationReports,
    fetchResolvedReports,
  };
};