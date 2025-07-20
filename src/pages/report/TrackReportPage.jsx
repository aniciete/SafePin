import { useState } from 'react';
import { supabase } from '../../config/supabase';
import { useNotification } from '../../components/common/notification/useNotification';

const TrackReportPage = () => {
  const [trackingCode, setTrackingCode] = useState('');
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const { addNotification } = useNotification();

  const handleTrackReport = async (e) => {
    e.preventDefault();
    setLoading(true);
    setReport(null);

    try {
      const { data, error } = await supabase
        .from('reports')
        .select('status, created_at')
        .eq('tracking_code', trackingCode)
        .single();

      if (error || !data) {
        throw new Error('Report not found.');
      }

      setReport(data);
    } catch (error) {
      addNotification({ message: error.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Track Your Report</h1>
      <form onSubmit={handleTrackReport}>
        <input
          type="text"
          placeholder="Enter your tracking code"
          value={trackingCode}
          onChange={(e) => setTrackingCode(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Track Report'}
        </button>
      </form>

      {report && (
        <div>
          <h2>Report Status</h2>
          <p><strong>Status:</strong> {report.status}</p>
          <p><strong>Submitted At:</strong> {new Date(report.created_at).toLocaleString()}</p>
        </div>
      )}
    </div>
  );
};

export default TrackReportPage;