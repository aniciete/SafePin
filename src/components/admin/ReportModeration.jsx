import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { getFormattedJurisdictions, getJurisdictionNameByCode } from '../../utils/jurisdictionUtils';
import { formatDateTime, formatLabel } from '../../utils/formatUtils';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Combobox } from '@/components/ui/combobox';
import { Skeleton } from '@/components/ui/skeleton';
import { Paperclip, FileX2, Loader2 } from 'lucide-react';
import ReportQuickView from '../dashboard/ReportQuickView';
import { motion } from 'framer-motion';

const AssignJurisdictionModal = ({ report, onAssigned }) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedJurisdiction, setSelectedJurisdiction] = useState(report.jurisdiction || '');
  const [isSaving, setIsSaving] = useState(false);
  const jurisdictionOptions = getFormattedJurisdictions();

  const handleSave = async () => {
    setIsSaving(true);
    const supabaseAdmin = getSupabaseAdmin();
    const { error } = await supabaseAdmin
      .from('reports')
      .update({ jurisdiction: selectedJurisdiction })
      .eq('id', report.id);
    
    if (error) {
      toast({ title: 'Error', description: `Failed to assign jurisdiction. ${error.message}`, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Jurisdiction assigned.' });
      onAssigned();
      setIsOpen(false);
    }
    setIsSaving(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="ml-2">
          {report.jurisdiction ? 'Change' : 'Assign'}
        </Button>
      </DialogTrigger>
      <DialogContent className="text-foreground">
        <DialogHeader>
          <DialogTitle>Assign Jurisdiction</DialogTitle>
          <DialogDescription>Select a barangay for report ID: {report.tracking_code}</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Combobox
            options={jurisdictionOptions}
            value={selectedJurisdiction}
            onChange={setSelectedJurisdiction}
            placeholder="Select a jurisdiction..."
            searchPlaceholder="Search barangay or city..."
          />
        </div>
        <DialogFooter>
          <DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSaving ? 'Saving...' : 'Save Assignment'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const REPORTS_PER_PAGE = 25;

const ReportModeration = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [view, setView] = useState('main');
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const { toast } = useToast();
  const [selectedReportForView, setSelectedReportForView] = useState(null);

  const fetchReports = useCallback(async (currentPage, shouldAppend = false) => {
    if (currentPage === 0) setLoading(true);
    else setLoadingMore(true);
    
    try {
      const from = currentPage * REPORTS_PER_PAGE;
      const to = from + REPORTS_PER_PAGE - 1;

      const supabaseAdmin = getSupabaseAdmin();
      let query = supabaseAdmin
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false })
        .range(from, to);

      if (view === 'flagged') {
        query = query.eq('is_flagged', true);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      const newReports = data || [];
      
      setReports(prev => shouldAppend ? [...prev, ...newReports] : newReports);
      
      if (newReports.length < REPORTS_PER_PAGE) {
        setHasMore(false);
      }

    } catch (error) {
      toast({ title: 'Error fetching reports', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [view, toast]);

  useEffect(() => {
    setReports([]);
    setPage(0);
    setHasMore(true);
    // The fetchReports dependency is stable due to useCallback, but view changes trigger it.
    // We pass 0 to ensure it fetches the first page.
    fetchReports(0, false);
  }, [view, fetchReports]);

  const handleLoadMore = () => {
    // This will trigger the next fetch because `page` is a dependency in the data-fetching useEffect
    setPage(prevPage => prevPage + 1);
  };
  
  // This effect runs when page changes, but only for subsequent pages
  useEffect(() => {
    if (page > 0) {
      fetchReports(page, true);
    }
  }, [page, fetchReports]);
  
  const refetchAll = useCallback(() => {
    setReports([]);
    setPage(0);
    setHasMore(true);
    fetchReports(0, false);
  }, [fetchReports]);

  const handleDelete = async (reportId) => {
    const supabaseAdmin = getSupabaseAdmin();
    try {
      const { error } = await supabaseAdmin.from('reports').delete().eq('id', reportId);
      if (error) throw error;
      toast({ title: 'Success', description: 'Report deleted successfully!' });
      refetchAll();
    } catch (error) {
      toast({ title: 'Error deleting report', description: error.message, variant: 'destructive' });
    }
  };

  const handleFlag = async (reportId, isFlagged) => {
    const supabaseAdmin = getSupabaseAdmin();
    try {
      const { error } = await supabaseAdmin.from('reports').update({ is_flagged: isFlagged }).eq('id', reportId);
      if (error) throw error;
      toast({ title: 'Success', description: `Report ${isFlagged ? 'flagged' : 'unflagged'} successfully!` });
      refetchAll();
    } catch (error) {
      toast({ title: 'Error updating report', description: error.message, variant: 'destructive' });
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.02 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Report Moderation</h1>
          <p className="text-muted-foreground">Review, assign, and manage all submitted reports.</p>
        </div>
        <Card>
          <CardContent className="p-4">
            <div className="border-b mb-4">
              <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                <button
                  className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${view === 'main' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                  onClick={() => setView('main')}
                >
                  Main Queue
                </button>
                <button
                  className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${view === 'flagged' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                  onClick={() => setView('flagged')}
                >
                  Flagged Reports
                </button>
              </nav>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[25%]">Incident</TableHead>
                    <TableHead className="w-[30%]">Jurisdiction</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <motion.tbody variants={containerVariants} initial="hidden" animate="visible">
                  {loading && reports.length === 0 ? (
                    [...Array(10)].map((_, i) => (
                      <TableRow key={`skeleton-${i}`}>
                        <TableCell colSpan={4}><Skeleton className="h-12 w-full" /></TableCell>
                      </TableRow>
                    ))
                  ) : reports.length > 0 ? (
                    reports.map((report) => (
                      <motion.tr
                        key={report.id}
                        variants={itemVariants}
                        layout
                        onClick={() => setSelectedReportForView(report)}
                        className="cursor-pointer hover:bg-muted/50"
                      >
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {report.image_path && <Paperclip className="h-4 w-4 text-muted-foreground flex-shrink-0" />}
                            <div>
                              <div className="font-medium">{report.incident_type_other || report.incident_type}</div>
                              <div className="text-xs text-muted-foreground">{formatDateTime(report.created_at)}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div
                            className="flex items-center"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span className="truncate">{getJurisdictionNameByCode(report.jurisdiction)}</span>
                            <AssignJurisdictionModal report={report} onAssigned={refetchAll} />
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(report.status)}>
                           {formatLabel(report.status)}
                          </Badge>
                        </TableCell>
                        <TableCell
                          className="text-right space-x-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Button onClick={() => handleFlag(report.id, !report.is_flagged)} variant="outline" size="sm">
                            {report.is_flagged ? 'Unflag' : 'Flag'}
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild><Button variant="destructive" size="sm">Delete</Button></DialogTrigger>
                            <DialogContent className="text-foreground">
                              <DialogHeader><DialogTitle>Are you sure?</DialogTitle><DialogDescription>This action cannot be undone and will permanently delete the report.</DialogDescription></DialogHeader>
                              <DialogFooter>
                                <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                                <Button variant="destructive" onClick={() => handleDelete(report.id)}>Delete</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </motion.tr>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">
                        <div className="flex flex-col items-center justify-center text-center py-6">
                            <FileX2 className="h-12 w-12 text-muted-foreground" />
                            <h3 className="mt-4 text-lg font-semibold">No Reports Found</h3>
                            <p className="mt-1 text-sm text-muted-foreground">There are no reports in this queue.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </motion.tbody>
              </Table>
            </div>
            <div className="flex justify-center mt-4">
              {hasMore && !loading && (
                <Button onClick={handleLoadMore} disabled={loadingMore}>
                  {loadingMore && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {loadingMore ? 'Loading...' : 'Load More'}
                </Button>
              )}
              {!hasMore && reports.length > 0 && (
                <p className="text-sm text-muted-foreground">You've reached the end of the list.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <ReportQuickView
        report={selectedReportForView}
        onClose={() => setSelectedReportForView(null)}
        onReportUpdate={refetchAll}
      />
    </>
  );
};

export default ReportModeration;