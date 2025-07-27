import { useState, useEffect, useCallback } from 'react';
import { useSupabase } from '../../contexts/SupabaseContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDateTime, formatLabel } from '@/utils/formatUtils';
import { Trash2, Search, CheckCircle, Clock, ShieldCheck, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

const getSavedCodes = () => {
  try {
    const codes = localStorage.getItem('savedReportCodes');
    return codes ? JSON.parse(codes) : [];
  } catch (error) {
    console.error("Failed to parse saved report codes:", error);
    return [];
  }
};

// --- UPDATED STATUS DETAILS FOR NEW DESIGN ---
// --- UPDATED STATUS DETAILS FOR HIGH CONTRAST ---
const statusDetails = {
  pending_verification: {
    title: "Report Submitted",
    description: "Your report is in the queue for verification by our team. Please check back later for updates.",
    icon: Clock,
    // FIX: Use a dark green text color for high contrast
    badgeClasses: "bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-300",
  },
  verified: {
    title: "Report Verified & Forwarded",
    description: "Your report has been verified and sent to the appropriate authorities. They are now handling the situation.",
    icon: ShieldCheck,
    // FIX: Use a dark blue text color for high contrast
    badgeClasses: "bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-300",
  },
  resolved: {
    title: "Action Taken",
    description: "The authorities have reviewed and addressed this report. The case is now considered closed. Thank you for your help.",
    icon: CheckCircle,
    // FIX: Use a darker gray text color for high contrast
    badgeClasses: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
  },
  rejected: {
    title: "Report Closed",
    description: "After review, this report has been closed. This may occur if it is a duplicate, lacks actionable information, or is outside of our scope.",
    icon: CheckCircle,
    // FIX: Use a dark red text color for high contrast
    badgeClasses: "bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-300",
  }
};


const MyReportsPage = () => {
  const { supabase } = useSupabase();
  const { toast } = useToast();

  const [inputCode, setInputCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  
  const [savedCodes, setSavedCodes] = useState(getSavedCodes);
  const [trackedReports, setTrackedReports] = useState([]);

  const fetchTrackedReports = useCallback(async () => {
    if (savedCodes.length === 0) {
      setTrackedReports([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('public_reports')
        .select('tracking_code, incident_type, status, created_at, incident_type_other')
        .in('tracking_code', savedCodes);
      
      if (error) throw error;
      
      const sortedData = savedCodes
        .map(code => data.find(report => report.tracking_code === code))
        .filter(Boolean);

      setTrackedReports(sortedData);
    } catch (error) {
      toast({ title: 'Error', description: 'Could not fetch report details.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [savedCodes, supabase, toast]);

  useEffect(() => {
    fetchTrackedReports();
  }, [fetchTrackedReports]);

  const handleTrackNewCode = async (e) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    setIsSearching(true);
    try {
      const { data, error } = await supabase
        .from('public_reports')
        .select('tracking_code')
        .eq('tracking_code', inputCode.trim())
        .single();
      if (error || !data) throw new Error('Report not found. Please check the tracking code.');
      
      const newCode = data.tracking_code;
      if (!savedCodes.includes(newCode)) {
        const updatedCodes = [newCode, ...savedCodes];
        setSavedCodes(updatedCodes);
        localStorage.setItem('savedReportCodes', JSON.stringify(updatedCodes));
        toast({ title: 'Success', description: 'Report has been added to your list.' });
      } else {
        toast({ description: 'This report is already in your list.' });
      }
      setInputCode('');
    } catch (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setIsSearching(false);
    }
  };

  const handleRemoveCode = (codeToRemove) => {
    const updatedCodes = savedCodes.filter(code => code !== codeToRemove);
    setSavedCodes(updatedCodes);
    localStorage.setItem('savedReportCodes', JSON.stringify(updatedCodes));
    toast({ description: 'Report removed from your list.' });
  };
  
  return (
    <div className="container mx-auto max-w-4xl py-12 px-4">
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">My Reports</h1>
          <p className="mt-2 text-muted-foreground">Track a new report or view the status of your saved reports.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Track a New Report</CardTitle>
            <CardDescription>Enter a tracking code to add it to your list below.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleTrackNewCode} className="flex items-center gap-2">
              <Label htmlFor="trackingCode" className="sr-only">Tracking Code</Label>
              <Input id="trackingCode" placeholder="Enter tracking code (e.g., SP-12345...)" value={inputCode} onChange={(e) => setInputCode(e.target.value)} disabled={isSearching} />
              <Button type="submit" disabled={isSearching} className="w-28">
                {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Track'}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">Saved Reports</h2>
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-36 w-full" />)}
            </div>
          ) : trackedReports.length > 0 ? (
            <div className="space-y-4">
              {trackedReports.map(report => {
                const details = statusDetails[report.status] || statusDetails.pending_verification;
                const Icon = details.icon;

                return (
                  <Card key={report.tracking_code} className="overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between p-4">
                      <div>
                        <CardTitle className="text-lg">{details.title}</CardTitle>
                        <CardDescription className="font-mono pt-1">{report.tracking_code}</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={cn("capitalize flex items-center gap-1.5", details.badgeClasses)}>
                          <Icon className="h-3 w-3" />
                          <span>{report.status.replace(/_/g, ' ')}</span>
                        </Badge>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleRemoveCode(report.tracking_code)}>
                          <Trash2 className="h-4 w-4 text-muted-foreground" />
                          <span className="sr-only">Remove report</span>
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 space-y-2 border-t">
                      <p className="text-sm text-muted-foreground">{details.description}</p>
                      <p className="text-xs text-muted-foreground pt-2">
                        Original Report Submitted: {formatDateTime(report.created_at)}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <Search className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-lg font-semibold">No Saved Reports</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Track a report using the form above to save it here for later.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyReportsPage;