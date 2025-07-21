import { useState } from 'react';
import { supabase } from '../../config/supabase';
import { useToast } from '../../hooks/use-toast';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Label } from '../../components/common/Label';
import Card from '../../components/common/Card';

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
    <main className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card>
        <h1 className="text-2xl font-bold text-center mb-8">Track Your Report</h1>
        <form onSubmit={handleTrackReport} className="space-y-4">
          <div className="grid w-full items-center gap-1.5">
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
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Searching...' : 'Track Report'}
          </Button>
        </form>

        {report && (
          <div className="mt-8 p-4 border rounded-md bg-gray-50">
            <h2 className="text-xl font-bold text-center mb-4">Report Status</h2>
            <p className="text-center"><strong>Status:</strong> {report.status}</p>
            <p className="text-center"><strong>Submitted At:</strong> {new Date(report.created_at).toLocaleString()}</p>
          </div>
        )}
      </Card>
    </main>
  );
};

export default TrackReportPage;