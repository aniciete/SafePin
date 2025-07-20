import React, { useState, useEffect } from 'react';
import { supabase } from '../../config/supabase';
import jurisdictions from '../../utils/jurisdictions.json';

const ReportModeration = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching reports:', error);
    } else {
      setReports(data);
    }
    setLoading(false);
  };

  const handleJurisdictionChange = async (reportId, newJurisdiction) => {
    const { error } = await supabase
      .from('reports')
      .update({ jurisdiction: newJurisdiction })
      .eq('id', reportId);

    if (error) {
      console.error('Error updating jurisdiction:', error);
    } else {
      fetchReports(); // Refresh the list
    }
  };

  const handleDelete = async (reportId) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      const { error } = await supabase
        .from('reports')
        .delete()
        .eq('id', reportId);

      if (error) {
        console.error('Error deleting report:', error);
      } else {
        fetchReports(); // Refresh the list
      }
    }
  };

  if (loading) {
    return <div>Loading reports...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Report Moderation</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Date</th>
              <th className="py-2 px-4 border-b">Report Type</th>
              <th className="py-2 px-4 border-b">Description</th>
              <th className="py-2 px-4 border-b">Location</th>
              <th className="py-2 px-4 border-b">Jurisdiction</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.id}>
                <td className="py-2 px-4 border-b">{new Date(report.created_at).toLocaleString()}</td>
                <td className="py-2 px-4 border-b">{report.report_type}</td>
                <td className="py-2 px-4 border-b">{report.description}</td>
                <td className="py-2 px-4 border-b">{`Lat: ${report.latitude}, Lng: ${report.longitude}`}</td>
                <td className="py-2 px-4 border-b">
                  <select
                    value={report.jurisdiction || ''}
                    onChange={(e) => handleJurisdictionChange(report.id, e.target.value)}
                    className="border p-1"
                  >
                    <option value="">Assign Jurisdiction</option>
                    {jurisdictions.map((j) => (
                      <option key={j.psgc_code} value={j.barangay + ', ' + j.city}>
                        {j.barangay}, {j.city}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => handleDelete(report.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportModeration;