import { useState } from 'react';
import { supabase } from '../../config/supabase';
import { useToast } from '../../hooks/use-toast';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Label } from '../../components/common/Label';

const TrackReportPage = () => {
  const [trackingCode, setTrackingCode] = useState('');
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

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
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Track Your Report</h1>
      <form onSubmit={handleTrackReport} className="flex items-end space-x-2">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="trackingCode">Tracking Code</Label>
          <Input
            type="text"
            id="trackingCode"
            placeholder="Enter your tracking code"
            value={trackingCode}
            onChange={(e) => setTrackingCode(e.target.value)}
            required
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Track Report'}
        </Button>
      </form>

      {report && (
        <div className="mt-4 p-4 border rounded-md">
          <h2 className="text-xl font-bold">Report Status</h2>
          <p><strong>Status:</strong> {report.status}</p>
          <p><strong>Submitted At:</strong> {new Date(report.created_at).toLocaleString()}</p>
        </div>
      )}
    </div>
  );
};

export default TrackReportPage;