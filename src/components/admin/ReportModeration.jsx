import { useState, useEffect, useCallback } from 'react';
import { useSupabase } from '../../contexts/SupabaseContext';
import ReportListItemSkeleton from '../report/ReportListItemSkeleton';
import { useToast } from '@/hooks/use-toast';
import jurisdictions from '../../utils/jurisdictions.json';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';

const ReportModeration = () => {
  const { supabase } = useSupabase();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [view, setView] = useState('main');
  const { toast } = useToast();

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase.from('reports').select('*').order('created_at', { ascending: false });
      if (view === 'flagged') {
        query = query.eq('is_flagged', true);
      } else {
        query = query.or('is_flagged.is.null,is_flagged.eq.false');
      }
      const { data, error } = await query;
      if (error) throw error;
      setReports(data);
    } catch (error) {
      toast({
        title: 'Error fetching reports',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [supabase, toast, view]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleViewReport = (report) => {
    setSelectedReport(report);
    setIsModalOpen(true);
  };

  const handleJurisdictionChange = async (reportId, newJurisdiction) => {
    try {
      const { error } = await supabase
        .from('reports')
        .update({ jurisdiction: newJurisdiction })
        .eq('id', reportId);
      if (error) throw error;
      toast({ title: 'Success', description: 'Jurisdiction updated successfully!' });
      fetchReports();
    } catch (error) {
      toast({ title: 'Error updating jurisdiction', description: error.message, variant: 'destructive' });
    }
  };

  const handleDelete = async (reportId) => {
    try {
      const { error } = await supabase.from('reports').delete().eq('id', reportId);
      if (error) throw error;
      toast({ title: 'Success', description: 'Report deleted successfully!' });
      fetchReports();
    } catch (error) {
      toast({ title: 'Error deleting report', description: error.message, variant: 'destructive' });
    }
  };

  const handleFlag = async (reportId, isFlagged) => {
    try {
      const { error } = await supabase.from('reports').update({ is_flagged: isFlagged }).eq('id', reportId);
      if (error) throw error;
      toast({ title: 'Success', description: `Report ${isFlagged ? 'flagged' : 'unflagged'} successfully!` });
      fetchReports();
    } catch (error) {
      toast({ title: 'Error updating report', description: error.message, variant: 'destructive' });
    }
  };

  const getJurisdictionName = (code) => {
    if (!code) return 'Unassigned';
    const match = jurisdictions.find(j => j.psgc_code === code);
    return match ? `${match.barangay}, ${match.city}` : code;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Report Moderation</h2>
        <div className="overflow-x-auto rounded-lg border">
          {[...Array(5)].map((_, index) => <ReportListItemSkeleton key={index} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Report Moderation</h2>
      <div className="flex space-x-4 border-b">
        <button
          className={`py-2 px-4 text-sm font-medium ${view === 'main' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-primary'}`}
          onClick={() => setView('main')}
        >
          Main Queue
        </button>
        <button
          className={`py-2 px-4 text-sm font-medium ${view === 'flagged' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-primary'}`}
          onClick={() => setView('flagged')}
        >
          Flagged Reports
        </button>
      </div>
      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full divide-y">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold">Incident Type</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Jurisdiction</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Status</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {reports.map((report) => (
              <tr key={report.id} className="hover:bg-muted/50">
                <td className="px-4 py-2 whitespace-nowrap cursor-pointer" onClick={() => handleViewReport(report)}>
                  <div className="font-medium">{report.incident_type}</div>
                  <div className="text-xs text-muted-foreground">{new Date(report.created_at).toLocaleString()}</div>
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <Select onValueChange={(value) => handleJurisdictionChange(report.id, value)} defaultValue={report.jurisdiction || ''}>
                    <SelectTrigger className="w-[220px]"><SelectValue placeholder="Assign Jurisdiction" /></SelectTrigger>
                    <SelectContent>
                      {jurisdictions.map((j) => (
                        <SelectItem key={j.psgc_code} value={j.psgc_code}>
                          {j.barangay}, {j.city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-muted-foreground">{report.status}</td>
                <td className="px-4 py-2 whitespace-nowrap space-x-2">
                  <Button onClick={() => handleFlag(report.id, !report.is_flagged)} variant="outline" size="sm">
                    {report.is_flagged ? 'Unflag' : 'Flag'}
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild><Button variant="destructive" size="sm">Delete</Button></DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Are you sure?</DialogTitle>
                        <DialogDescription>This action cannot be undone. This will permanently delete the report.</DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                        <Button variant="destructive" onClick={() => handleDelete(report.id)}>Delete</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedReport && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Report Details</DialogTitle>
              <DialogDescription>Full details for report ID: {selectedReport.tracking_code}</DialogDescription>
            </DialogHeader>
            <div className="p-4 space-y-2 text-sm">
              <p><strong>Incident Type:</strong> {selectedReport.incident_type}</p>
              <p><strong>Description:</strong> {selectedReport.description || 'No description provided.'}</p>
              <p><strong>Location:</strong> {selectedReport.location ? `Lat: ${selectedReport.location.lat}, Lng: ${selectedReport.location.lng}` : 'Not provided'}</p>
              <p><strong>Status:</strong> {selectedReport.status}</p>
              <p><strong>Jurisdiction:</strong> {getJurisdictionName(selectedReport.jurisdiction)}</p>
              {selectedReport.image_path && <p><strong>Image Path:</strong> {selectedReport.image_path}</p>}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ReportModeration;