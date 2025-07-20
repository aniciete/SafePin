import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../config/supabase';
import { useNotification } from '../common/notification/useNotification';
import jurisdictions from '../../utils/jurisdictions.json';

const ReportModeration = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addNotification } = useNotification();

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      // Admins bypass RLS, so this will fetch all reports.
      const { data, error } = await supabase.from('reports').select('*');
      if (error) throw error;
      setReports(data);
    } catch (error) {
      addNotification({ message: `Error fetching reports: ${error.message}`, type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [addNotification]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleJurisdictionChange = async (reportId, newJurisdiction) => {
    try {
      const { error } = await supabase
        .from('reports')
        .update({ jurisdiction: newJurisdiction })
        .eq('id', reportId);
      if (error) throw error;
      addNotification({ message: 'Jurisdiction updated successfully!', type: 'success' });
      fetchReports();
    } catch (error) {
      addNotification({ message: `Error updating jurisdiction: ${error.message}`, type: 'error' });
    }
  };

  const handleDelete = async (reportId) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      try {
        const { error } = await supabase.from('reports').delete().eq('id', reportId);
        if (error) throw error;
        addNotification({ message: 'Report deleted successfully!', type: 'success' });
        fetchReports();
      } catch (error) {
        addNotification({ message: `Error deleting report: ${error.message}`, type: 'error' });
      }
    }
  };

  if (loading) {
    return <div>Loading reports...</div>;
  }

  return (
    <div>
      <h2>Report Moderation</h2>
      <table>
        <thead>
          <tr>
            <th>Incident Type</th>
            <th>Jurisdiction</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => (
            <tr key={report.id}>
              <td>{report.incident_type}</td>
              <td>
                <select
                  value={report.jurisdiction || ''}
                  onChange={(e) => handleJurisdictionChange(report.id, e.target.value)}
                >
                  <option value="">Assign Jurisdiction</option>
                  {jurisdictions.map((j) => (
                    <option key={j.psgc_code} value={j.psgc_code}>
                      {j.barangay}, {j.city}
                    </option>
                  ))}
                </select>
              </td>
              <td>{report.status}</td>
              <td>
                <button onClick={() => handleDelete(report.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReportModeration;