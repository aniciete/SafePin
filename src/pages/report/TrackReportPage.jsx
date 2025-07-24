import { useState } from 'react';
import { useSupabase } from '../../contexts/SupabaseContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
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
    <main className="flex items-center justify-center py-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Track Your Report</CardTitle>
        </CardHeader>
        <CardContent>
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
            <div className="mt-8 p-6 border rounded-lg bg-card">
              <h2 className="text-xl font-bold text-center mb-6">Report Progress</h2>
              <StatusTimeline status={report.status} />
              <p className="text-center text-sm text-muted-foreground mt-6">
                Submitted At: {new Date(report.created_at).toLocaleString()}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
};

export default TrackReportPage;