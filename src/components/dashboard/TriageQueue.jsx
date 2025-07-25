import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { updateReportStatus } from '../../services/report.service';
import { useToast } from '@/hooks/use-toast';
import ReportListItemSkeleton from '../report/ReportListItemSkeleton';
import { useSupabase } from '@/contexts/SupabaseContext'; // <-- IMPORT useSupabase

const TriageQueue = ({ reports, onReportUpdate, loading }) => {
  const { toast } = useToast();
  const { supabase } = useSupabase(); // <-- GET the supabase client instance

  const handleUpdateStatus = async (reportId, newStatus) => {
    try {
      // Pass the supabase client as the first argument, as required by the service function
      await updateReportStatus(supabase, reportId, newStatus);
      toast({
        title: 'Success',
        description: `Report status updated to ${newStatus}.`,
      });
      onReportUpdate();
    } catch (error) {
      console.error(`Failed to update report to ${newStatus}:`, error);
      toast({
        title: 'Error',
        description: `Could not update report. ${error.message}`,
        variant: 'destructive',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Triage Queue</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
        {loading ? (
          [...Array(5)].map((_, i) => <ReportListItemSkeleton key={i} />)
        ) : reports && reports.length > 0 ? (
          reports.map(report => (
            <div key={report.id} className="p-4 border rounded-lg">
              <h3 className="font-semibold">{report.incident_type}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{new Date(report.created_at).toLocaleString()}</p>
              <p className="text-sm mt-2">{report.description?.substring(0, 100)}...</p>
              <div className="flex justify-end space-x-2 mt-4">
                <Button onClick={() => handleUpdateStatus(report.id, 'verified')} size="sm">Verify</Button>
                <Button onClick={() => handleUpdateStatus(report.id, 'rejected')} size="sm" variant="destructive">Reject</Button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">No pending reports in the queue.</p>
        )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TriageQueue;