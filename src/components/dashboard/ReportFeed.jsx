import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import ReportFeedItem from './ReportFeedItem';
import ReportListItemSkeleton from '../report/ReportListItemSkeleton';

const ReportFeed = ({ reports, selectedReportId, onSelectReport, onHoverReport, loading }) => {
  return (
    <Card className="h-full flex flex-col shadow-lg">
      <CardHeader>
        <CardTitle>Report Feed</CardTitle>
        <CardDescription>
          {/* THIS IS THE FIX: We now display the length of the 'reports' prop, */}
          {/* which is the correctly filtered array. */}
          {loading ? 'Loading reports...' : `${reports.length} report${reports.length !== 1 ? 's' : ''} in your jurisdiction.`}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow overflow-y-auto pr-3">
        {loading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => <ReportListItemSkeleton key={i} />)}
          </div>
        ) : reports.length > 0 ? (
          <div className="space-y-3">
            {reports.map(report => (
              <ReportFeedItem
                key={report.id}
                report={report}
                isSelected={report.id === selectedReportId}
                onSelect={() => onSelectReport(report.id)}
                onHover={onHoverReport}
              />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">No reports found.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReportFeed;