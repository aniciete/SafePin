// src/components/dashboard/ReportQuickView.jsx (New and Correct)
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const ReportQuickView = ({ report, onClose }) => {
  if (!report) return null;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report Details</DialogTitle>
          <DialogDescription>
            Quick summary of the incident report.
          </DialogDescription>
        </DialogHeader>
        {/* ...rest of the component... */}
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReportQuickView;