import { supabase } from '../config/supabase.js';

/**
 * Fetches all reports from the database.
 * RLS is expected to handle filtering by jurisdiction.
 * @returns {Promise<Array<object>>} A promise that resolves to an array of reports.
 */
export const getReports = async () => {
  const { data, error } = await supabase.from('reports').select('*');

  if (error) {
    console.error('Error fetching reports:', error);
    throw new Error(error.message);
  }

  return data;
};