import React from 'react';
import Card from '../common/Card';
import { Button } from '../common/Button';
import { updateReportStatus } from '../../services/report.service';

const TriageQueue = ({ reports, onReportUpdate }) => {

  const handleVerify = async (reportId) => {
    try {
      await updateReportStatus(reportId, 'Verified');
      onReportUpdate();
    } catch (error) {
      console.error("Failed to verify report:", error);
    }
  };

  const handleReject = async (reportId) => {
    try {
      await updateReportStatus(reportId, 'Rejected');
      onReportUpdate();
    } catch (error) {
      console.error("Failed to reject report:", error);
    }
  };

  const handleRequestMoreInfo = (reportId) => {
    console.log(`Requesting more info for report ${reportId}`);
    // Placeholder for future implementation
  };

  return (
    <Card>
      <h2 className="text-lg font-semibold mb-4">Triage Queue</h2>
      <div className="space-y-4">
        {reports && reports.length > 0 ? (
          reports.map(report => (
            <div key={report.id} className="p-4 border rounded-lg">
              <h3 className="font-semibold">{report.incident_type}</h3>
              <p className="text-sm text-gray-600">{new Date(report.created_at).toLocaleDateString()}</p>
              <p className="text-sm mt-2">{report.description.substring(0, 100)}...</p>
              <div className="flex justify-end space-x-2 mt-4">
                <Button onClick={() => handleVerify(report.id)} size="sm">Verify</Button>
                <Button onClick={() => handleReject(report.id)} size="sm" variant="destructive">Reject</Button>
                <Button onClick={() => handleRequestMoreInfo(report.id)} size="sm" variant="outline">Request More Info</Button>
              </div>
            </div>
          ))
        ) : (
          <p>No pending reports in the queue.</p>
        )}
      </div>
    </Card>
  );
};

export default TriageQueue;