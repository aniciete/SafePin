import { useState } from 'react';
import { supabase } from '../../config/supabase';
import { useToast } from '../../hooks/use-toast';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Label } from '../../components/common/Label';
import Card from '../../components/common/Card';
import StatusTimeline from '../../components/report/StatusTimeline';

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
    <main className="flex items-center justify-center">
      <Card>
        <h1 className="text-2xl font-bold text-center mb-8 dark:text-white">Track Your Report</h1>
        <form onSubmit={handleTrackReport} className="space-y-4">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="trackingCode" className="dark:text-white">Tracking Code</Label>
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
          <div className="mt-8 p-6 border rounded-lg bg-gray-50 dark:bg-neutral-800 dark:border-neutral-700">
            <h2 className="text-xl font-bold text-center mb-6 dark:text-white">Report Progress</h2>
            <StatusTimeline status={report.status} />
            <p className="text-center text-sm text-gray-500 dark:text-neutral-400 mt-6">
              Submitted At: {new Date(report.created_at).toLocaleString()}
            </p>
          </div>
        )}
      </Card>
    </main>
  );
};

export default TrackReportPage;