import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Paperclip } from 'lucide-react';

const timeAgo = (date) => {
  if (!date) return '';
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return "just now";
};

const ReportFeedItem = ({ report, isSelected, onSelect, onHover }) => {
  const getSeverityClass = () => {
    switch (report.severity?.toLowerCase()) {
      case 'critical': return 'border-destructive';
      case 'high': return 'border-yellow-500';
      case 'medium': return 'border-secondary';
      default: return 'border-primary';
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
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      // --- THIS IS THE FIX ---
      // We remove `backgroundColor` from the animation prop.
      // Framer Motion will now only handle the scaling.
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
      onClick={onSelect}
      onMouseEnter={() => onHover(report.id)}
      onMouseLeave={() => onHover(null)}
      className={cn(
        "p-3 rounded-lg border-l-4 cursor-pointer transition-colors", // Added `transition-colors` for smooth background change
        getSeverityClass(),
        isSelected ? "bg-muted shadow-md" : "bg-card hover:bg-muted", // Added `hover:bg-muted` to let Tailwind handle the hover effect
        report.status === 'resolved' ? 'opacity-60' : ''
      )}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          {report.image_url && (
            <Paperclip className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          )}
          <h4 className="font-semibold text-sm">{report.incident_type}</h4>
        </div>
        <Badge variant={getStatusVariant(report.status)} className="text-xs capitalize">
          {report.status.replace(/_/g, ' ')}
        </Badge>
      </div>
      <p className="text-xs text-muted-foreground mt-1">{timeAgo(report.created_at)}</p>
      <p className="text-sm mt-2 line-clamp-2">{report.description}</p>
    </motion.div>
  );
};

export default ReportFeedItem;