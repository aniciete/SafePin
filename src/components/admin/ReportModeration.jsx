import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../config/supabase';
import ReportListItemSkeleton from '../report/ReportListItemSkeleton';
import { useToast } from '../../hooks/use-toast';
import jurisdictions from '../../utils/jurisdictions.json';
import { Button } from '../common/Button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../common/Select';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalTitle,
  ModalDescription,
  ModalTrigger,
} from '../common/Modal';

const ReportModeration = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [view, setView] = useState('main'); // 'main' or 'flagged'
  const { toast } = useToast();

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase.from('reports').select('*');
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
  }, [toast, view]);

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
      toast({
        title: 'Success',
        description: 'Jurisdiction updated successfully!',
      });
      fetchReports();
    } catch (error) {
      toast({
        title: 'Error updating jurisdiction',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (reportId) => {
    try {
      const { error } = await supabase.from('reports').delete().eq('id', reportId);
      if (error) throw error;
      toast({
        title: 'Success',
        description: 'Report deleted successfully!',
      });
      fetchReports();
    } catch (error) {
      toast({
        title: 'Error deleting report',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleFlag = async (reportId, isFlagged) => {
    try {
      const { error } = await supabase.from('reports').update({ is_flagged: isFlagged }).eq('id', reportId);
      if (error) throw error;
      toast({
        title: 'Success',
        description: `Report ${isFlagged ? 'flagged' : 'unflagged'} successfully!`,
      });
      fetchReports();
    } catch (error) {
      toast({
        title: 'Error updating report',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Report Moderation</h2>
        <div className="overflow-x-auto rounded-lg border-border">
          <table className="min-w-full divide-y-2 divide-border bg-white text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-text-primary">Incident Type</th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-text-primary">Jurisdiction</th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-text-primary">Status</th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-text-primary">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {Array.from({ length: 5 }).map((_, index) => (
                <tr key={index}>
                  <td colSpan="4">
                    <ReportListItemSkeleton />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Report Moderation</h2>
      <div className="flex space-x-4 border-b border-border">
        <button
          className={`py-2 px-4 text-text-secondary ${view === 'main' ? 'border-b-2 border-blue-500 text-blue-600' : 'hover:bg-gray-100'}`}
          onClick={() => setView('main')}
        >
          Main Queue
        </button>
        <button
          className={`py-2 px-4 text-text-secondary ${view === 'flagged' ? 'border-b-2 border-blue-500 text-blue-600' : 'hover:bg-gray-100'}`}
          onClick={() => setView('flagged')}
        >
          Flagged Reports
        </button>
      </div>
      <div className="overflow-x-auto rounded-lg border-border">
        <table className="min-w-full divide-y-2 divide-border bg-white text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-text-primary">Incident Type</th>
              <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-text-primary">Jurisdiction</th>
              <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-text-primary">Status</th>
              <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-text-primary">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {reports.map((report) => (
              <tr key={report.id} className="hover:bg-gray-50" onClick={() => handleViewReport(report)}>
                <td className="whitespace-nowrap px-4 py-2 font-medium text-text-primary">{report.incident_type}</td>
                <td className="whitespace-nowrap px-4 py-2 text-text-secondary">
                  <Select
                    onValueChange={(value) => handleJurisdictionChange(report.id, value)}
                    defaultValue={report.jurisdiction || ''}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Assign Jurisdiction" />
                    </SelectTrigger>
                    <SelectContent>
                      {jurisdictions.map((j) => (
                        <SelectItem key={j.psgc_code} value={j.psgc_code}>
                          {j.barangay}, {j.city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700 dark:text-neutral-300">{report.status}</td>
                <td className="whitespace-nowrap px-4 py-2 space-x-2">
                  <Button onClick={() => handleFlag(report.id, !report.is_flagged)}>
                    {report.is_flagged ? 'Unflag' : 'Flag'}
                  </Button>
                  <Modal>
                    <ModalTrigger asChild>
                      <Button variant="warning">Delete</Button>
                    </ModalTrigger>
                    <ModalContent>
                      <ModalHeader>
                        <ModalTitle>Are you sure?</ModalTitle>
                        <ModalDescription>
                          This action cannot be undone. This will permanently delete the report.
                        </ModalDescription>
                      </ModalHeader>
                      <ModalFooter>
                        <Button variant="tertiary" onClick={() => document.querySelector('[data-state="open"] button[aria-label="Close"]')?.click()}>Cancel</Button>
                        <Button variant="warning" onClick={() => handleDelete(report.id)}>Delete</Button>
                      </ModalFooter>
                    </ModalContent>
                  </Modal>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedReport && (
        <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Report Details</ModalTitle>
              <ModalDescription>
                Full details of the report.
              </ModalDescription>
            </ModalHeader>
            <div className="p-4">
              <p><strong>Incident Type:</strong> {selectedReport.incident_type}</p>
              <p><strong>Description:</strong> {selectedReport.description}</p>
              <p><strong>Location:</strong> {selectedReport.location}</p>
              <p><strong>Status:</strong> {selectedReport.status}</p>
              {selectedReport.image_url && (
                <img src={selectedReport.image_url} alt="Report" className="mt-4 w-full h-auto" />
              )}
            </div>
            <ModalFooter>
              <Button variant="tertiary" onClick={() => setIsModalOpen(false)}>Close</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </div>
  );
};

export default ReportModeration;