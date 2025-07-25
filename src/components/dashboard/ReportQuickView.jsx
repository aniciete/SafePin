import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useSupabase } from '@/contexts/SupabaseContext';
import { useGoogleMaps } from '@/hooks/useGoogleMaps';
import { useToast } from '@/hooks/use-toast';
import { Paperclip } from 'lucide-react';
import { formatDateTime, formatLabel } from '@/utils/formatUtils';

const ReportQuickView = ({ report, onClose, onReportUpdate }) => {
  const { supabase } = useSupabase();
  const { reverseGeocode } = useGoogleMaps();
  const { toast } = useToast();

  const [address, setAddress] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [notes, setNotes] = useState('');
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  useEffect(() => {
    if (!report) return;

    setAddress(null);
    setImageUrl(null);
    setNotes(report.notes || '');

    if (report.location) {
      reverseGeocode(report.location).then(setAddress);
    }
    if (report.image_path) {
      const fetchImageUrl = async () => {
        const { data, error } = await supabase.storage
          .from('reports')
          .createSignedUrl(report.image_path, 60);
        if (error) {
          console.error('Error fetching signed URL:', error);
          return;
        }
        setImageUrl(data.signedUrl);
      };
      fetchImageUrl();
    }
  }, [report, reverseGeocode, supabase]);

  if (!report) return null;

  const handleUpdateStatus = async (newStatus) => {
    setIsUpdatingStatus(true);
    try {
      const { error } = await supabase.from('reports').update({ status: newStatus }).eq('id', report.id);
      if (error) throw error;
      toast({ title: 'Success', description: `Report status updated to ${newStatus}.` });
      onReportUpdate();
      onClose();
    } catch (error) {
      toast({ title: 'Error', description: `Could not update report. ${error.message}`, variant: 'destructive' });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleSaveNotes = async () => {
    setIsSavingNotes(true);
    try {
      const { error } = await supabase.from('reports').update({ notes: notes }).eq('id', report.id);
      if (error) throw error;
      toast({ title: 'Success', description: 'Notes saved successfully.' });
      onReportUpdate();
    } catch (error) {
      toast({ title: 'Error', description: `Could not save notes. ${error.message}`, variant: 'destructive' });
    } finally {
      setIsSavingNotes(false);
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'pending_verification': return 'default';
      case 'verified': return 'secondary';
      case 'resolved': return 'outline';
      default: return 'destructive';
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            {report.incident_type}
            {report.image_path && <Paperclip className="h-5 w-5 text-muted-foreground" />}
          </DialogTitle>
          <DialogDescription>
            {address ? address : <Skeleton className="h-4 w-3/4" />}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {formatDateTime(report.created_at)}
            </span>
            <Badge variant={getStatusVariant(report.status)}>
              {formatLabel(report.status)}
            </Badge>
          </div>
          
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <h4 className="font-semibold mt-4 mb-1">Description</h4>
            <p>{report.description || "No description provided."}</p>
          </div>

          {report.contact_info && (
            <div>
              <h4 className="font-semibold mb-1">Confidential Contact Info</h4>
              <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md break-all">
                {report.contact_info}
              </p>
            </div>
          )}

          {report.image_path && (
            <div>
              <h4 className="font-semibold mb-2">Attached Image</h4>
              {imageUrl ? (
                <img src={imageUrl} alt="Incident report" className="rounded-lg border max-h-60 w-full object-contain" />
              ) : (
                <Skeleton className="h-48 w-full" />
              )}
            </div>
          )}
          
          <div className="space-y-2 pt-4 border-t">
            <Label htmlFor="notes" className="font-semibold">Internal Notes</Label>
            <Textarea
              id="notes"
              placeholder="Add investigation notes, actions taken, or follow-up reminders..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
            />
            <div className="flex justify-end">
              <Button onClick={handleSaveNotes} disabled={isSavingNotes} size="sm">
                {isSavingNotes ? 'Saving...' : 'Save Notes'}
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          {report.status === 'pending_verification' && (
            <div className="w-full flex justify-end gap-2">
              <Button variant="destructive" onClick={() => handleUpdateStatus('rejected')} disabled={isUpdatingStatus}>
                Reject
              </Button>
              <Button onClick={() => handleUpdateStatus('verified')} disabled={isUpdatingStatus}>
                Verify
              </Button>
            </div>
          )}
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReportQuickView;