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
import { useSupabase } from '@/contexts/SupabaseContext';
import { useGoogleMaps } from '@/hooks/useGoogleMaps';
import { useToast } from '@/hooks/use-toast';

const ReportQuickView = ({ report, onClose, onReportUpdate }) => {
  const { supabase } = useSupabase();
  const { reverseGeocode } = useGoogleMaps();
  const { toast } = useToast();

  const [address, setAddress] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!report) return;

    setAddress(null);
    setImageUrl(null);

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
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('reports')
        .update({ status: newStatus })
        .eq('id', report.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Report status updated to ${newStatus}.`,
      });
      onReportUpdate();
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: `Could not update report. ${error.message}`,
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
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
          <DialogTitle className="text-2xl">{report.incident_type}</DialogTitle>
          <DialogDescription>
            {address ? address : <Skeleton className="h-4 w-3/4" />}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {new Date(report.created_at).toLocaleString()}
            </span>
            <Badge variant={getStatusVariant(report.status)}>{report.status.replace(/_/g, ' ')}</Badge>
          </div>
          
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <h4 className="font-semibold mt-4 mb-1">Description</h4>
            <p>{report.description || "No description provided."}</p>
          </div>

          {/* *** ADD THE NEW CONTACT INFO SECTION *** */}
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
        </div>
        <DialogFooter>
          {report.status === 'pending_verification' && (
            <div className="w-full flex justify-end gap-2">
              <Button variant="destructive" onClick={() => handleUpdateStatus('rejected')} disabled={isUpdating}>
                Reject
              </Button>
              <Button onClick={() => handleUpdateStatus('verified')} disabled={isUpdating}>
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