import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../config/supabase';
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
  const { toast } = useToast();

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      // Admins bypass RLS, so this will fetch all reports.
      const { data, error } = await supabase.from('reports').select('*');
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
  }, [toast]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

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

  if (loading) {
    return <div>Loading reports...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Report Moderation</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Incident Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jurisdiction</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reports.map((report) => (
              <tr key={report.id}>
                <td className="px-6 py-4 whitespace-nowrap">{report.incident_type}</td>
                <td className="px-6 py-4 whitespace-nowrap">
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
                <td className="px-6 py-4 whitespace-nowrap">{report.status}</td>
                <td className="px-6 py-4 whitespace-nowrap">
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
    </div>
  );
};

export default ReportModeration;