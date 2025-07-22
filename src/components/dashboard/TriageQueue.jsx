import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { updateReportStatus } from '../../services/report.service';
import { useToast } from '@/hooks/use-toast';

const TriageQueue = ({ reports, onReportUpdate }) => {
  const { toast } = useToast();

  const handleUpdateStatus = async (reportId, newStatus) => {
    try {
      await updateReportStatus(reportId, newStatus);
      toast({
        title: 'Success',
        description: `Report status updated to ${newStatus}.`,
      });
      onReportUpdate(); // Refresh the reports list
    } catch (error) {
      console.error(`Failed to update report to ${newStatus}:`, error);
      toast({
        title: 'Error',
        description: `Could not update report. ${error.message}`,
        variant: 'destructive',
      });
    }
  };

  const handleRequestMoreInfo = (reportId) => {
    console.log(`Requesting more info for report ${reportId}`);
    // Placeholder for future implementation
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Triage Queue</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
        {reports && reports.length > 0 ? (
          reports.map(report => (
            <div key={report.id} className="p-4 border rounded-lg">
              <h3 className="font-semibold">{report.incident_type}</h3>
              <p className="text-sm text-gray-600">{new Date(report.created_at).toLocaleDateString()}</p>
              <p className="text-sm mt-2">{report.description?.substring(0, 100)}...</p>
              <div className="flex justify-end space-x-2 mt-4">
                <Button onClick={() => handleUpdateStatus(report.id, 'verified')} size="sm">Verify</Button>
                <Button onClick={() => handleUpdateStatus(report.id, 'rejected')} size="sm" variant="destructive">Reject</Button>
                <Button onClick={() => handleRequestMoreInfo(report.id)} size="sm" variant="outline">Request More Info</Button>
              </div>
            </div>
          ))
        ) : (
          <p>No pending reports in the queue.</p>
        )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TriageQueue;