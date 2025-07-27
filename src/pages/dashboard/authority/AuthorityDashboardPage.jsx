import { useState, useEffect, useMemo, useCallback } from 'react';
import { Routes, Route, Outlet, useOutletContext } from 'react-router-dom';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import MapView from '../../../components/map/MapView';
import Analytics from '../../../components/dashboard/Analytics';
import { useSupabase } from '../../../contexts/SupabaseContext';
import { useAuth } from '../../../contexts/AuthContext';
import ReportQuickView from '../../../components/dashboard/ReportQuickView';
import ReportFilters from '../../../components/dashboard/ReportFilters';
import { Card, CardContent } from '@/components/ui/card';
import SettingsPage from '../admin/SettingsPage';
import { Skeleton } from '@/components/ui/skeleton';
import ReportFeed from '../../../components/dashboard/ReportFeed';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { exportToCsv } from '../../../utils/csvUtils';
import { getJurisdictionNameByCode } from '../../../utils/jurisdictionUtils';
import { formatDateTime } from '../../../utils/formatUtils';

const DashboardContentSkeleton = () => (
  <div className="flex flex-col lg:flex-row gap-6 flex-grow min-h-0">
    <div className="lg:w-2/3 h-1/2 lg:h-full">
      <Skeleton className="h-full w-full" />
    </div>
    <div className="lg:w-1/3 h-1/2 lg:h-full">
      <Skeleton className="h-full w-full" />
    </div>
  </div>
);

const MapFeedView = () => {
  const {
    reports = [],
    loading = true,
    selectedReportId,
    hoveredReportId,
    setSelectedReportId,
    setHoveredReportId,
  } = useOutletContext() || {};

  return (
    <ReportFeed
      reports={reports}
      selectedReportId={selectedReportId}
      onSelectReport={setSelectedReportId}
      onHoverReport={setHoveredReportId}
      loading={loading}
    />
  );
};

const AuthorityDashboardLayout = () => {
  const outletContext = useOutletContext();
  const {
    reports,
    loading,
    selectedReportId,
    hoveredReportId,
    handleMarkerClick,
    jurisdictionCenter,
    panToLocation,
    zoomToLocation,
    handleFilterChange,
    handleExport,
  } = outletContext;

  return (
    <div className="space-y-6 h-full flex flex-col min-h-0">
      <div className="flex justify-between items-center flex-shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Jurisdiction Overview</h1>
          <p className="text-muted-foreground">Live incident feed and management tools for your area.</p>
        </div>
        <Button onClick={handleExport} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>
      
      <div className="flex-shrink-0">
        <ReportFilters onFilterChange={handleFilterChange} />
      </div>
      
      {loading ? ( <DashboardContentSkeleton /> ) : (
        // --- THIS IS THE FIX: Use proportional heights for mobile layout ---
        <div className="flex flex-col lg:flex-row gap-6 flex-grow min-h-0">
          {/* Map Container: Takes top 40% (h-2/5) of space on mobile, 2/3 width on desktop */}
          <div className="h-2/5 lg:h-full lg:w-2/3">
            <Card className="h-full shadow-lg">
              <CardContent className="h-full p-0">
                <MapView 
                  reports={reports}
                  isLoading={loading}
                  onMarkerClick={handleMarkerClick}
                  selectedReportId={selectedReportId}
                  hoveredReportId={hoveredReportId}
                  initialCenter={jurisdictionCenter}
                  initialZoom={15}
                  panToLocation={panToLocation}
                  zoomToLocation={zoomToLocation}
                />
              </CardContent>
            </Card>
          </div>
          {/* Outlet/Feed Container: Takes bottom 60% (h-3/5) of space on mobile, 1/3 width on desktop */}
          <div className="h-3/5 lg:h-full lg:w-1/3">
            <Outlet context={outletContext} />
          </div>
        </div>
      )}
    </div>
  );
};

const AuthorityDashboardPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const { supabase } = useSupabase();
  const { profile, loading: authLoading } = useAuth();
  const { toast } = useToast();

  const [selectedReportId, setSelectedReportId] = useState(null);
  const [hoveredReportId, setHoveredReportId] = useState(null);
  const [jurisdictionCenter, setJurisdictionCenter] = useState(null);
  const [panToLocation, setPanToLocation] = useState(null);
  const [zoomToLocation, setZoomToLocation] = useState(null);

  const fetchReports = useCallback(async () => {
    if (!profile?.jurisdiction) { setLoading(false); return; }
    setLoading(true);
    try {
      const { data, error } = await supabase.from('reports').select('*').order('created_at', { ascending: false }).limit(50);
      if (error) throw error;
      setReports(data || []);
    } catch (error) {
      console.error("Failed to fetch reports for jurisdiction:", error);
    } finally {
      setLoading(false);
    }
  }, [supabase, profile]);

  useEffect(() => {
    if (profile) {
      fetchReports();
      const channel = supabase.channel(`public:reports:jurisdiction=eq.${profile.jurisdiction}`).on('postgres_changes', { event: '*', schema: 'public', table: 'reports', filter: `jurisdiction=eq.${profile.jurisdiction}` }, () => fetchReports()).subscribe();
      return () => { supabase.removeChannel(channel) };
    }
  }, [profile, supabase, fetchReports]);

  useEffect(() => {
    if (profile?.jurisdiction) {
      const fetchCenter = async () => {
        const { data, error } = await supabase.rpc('get_jurisdiction_centroid', { jurisdiction_code: profile.jurisdiction });
        if (error) console.error('Error fetching jurisdiction center:', error);
        else setJurisdictionCenter(data);
      };
      fetchCenter();
    }
  }, [profile, supabase]);

  const filteredReports = useMemo(() => {
    return reports.filter(report => {
      const { startDate, endDate, incidentType, status, severity } = filters;
      if (startDate && new Date(report.created_at) < new Date(startDate)) return false;
      if (endDate && new Date(report.created_at) > new Date(endDate)) return false;
      if (incidentType && incidentType !== 'all' && report.incident_type !== incidentType) return false;
      if (status && status !== 'all' && report.status !== status) return false;
      if (severity && severity !== 'all' && report.severity !== severity) return false;
      return true;
    });
  }, [reports, filters]);

  const handleExport = useCallback(() => {
    if (filteredReports.length === 0) {
      toast({
        title: 'No Data to Export',
        description: 'The current filtered list of reports is empty.',
        variant: 'destructive',
      });
      return;
    }

    const exportData = filteredReports.map(report => ({
      tracking_code: report.tracking_code,
      incident_type: report.incident_type_other || report.incident_type,
      severity: report.severity,
      status: report.status,
      description: report.description,
      jurisdiction: getJurisdictionNameByCode(report.jurisdiction),
      latitude: report.location?.lat,
      longitude: report.location?.lng,
      date_reported: formatDateTime(report.created_at),
      has_image: !!report.image_path,
      is_flagged: report.is_flagged,
    }));

    const date = new Date().toISOString().split('T')[0];
    exportToCsv(exportData, `safepin-reports-${date}.csv`);
  }, [filteredReports, toast]);

  const handleHoverReport = useCallback((reportId) => {
    setHoveredReportId(reportId);
    if (reportId) {
      const report = reports.find(r => r.id === reportId);
      if (report?.location) {
        setZoomToLocation({ center: report.location, zoom: 17 });
      }
    }
  }, [reports]);

  const handleFilterChange = useCallback((newFilters) => setFilters(newFilters), []);
  const handleMarkerClick = useCallback((reportId) => setSelectedReportId(reportId), []);
  const handleCloseQuickView = useCallback(() => setSelectedReportId(null), []);

  useEffect(() => {
    if (selectedReportId) {
      const report = reports.find(r => r.id === selectedReportId);
      if (report?.location) setPanToLocation(report.location);
    }
  }, [selectedReportId, reports]);

  const selectedReport = useMemo(() => reports.find(r => r.id === selectedReportId) || null, [reports, selectedReportId]);

  if (authLoading) {
    return <DashboardLayout><div className="flex items-center justify-center h-full">Authenticating...</div></DashboardLayout>;
  }

  const outletContext = {
    reports: filteredReports,
    allReports: reports,
    loading,
    selectedReportId,
    hoveredReportId,
    setSelectedReportId,
    setHoveredReportId: handleHoverReport,
    handleFilterChange,
    handleMarkerClick,
    handleExport,
    jurisdictionCenter,
    panToLocation,
    zoomToLocation,
  };

  return (
    <DashboardLayout>
      <Outlet context={outletContext} />
      <ReportQuickView 
        report={selectedReport} 
        onClose={handleCloseQuickView}
        onReportUpdate={fetchReports}
      />
    </DashboardLayout>
  );
};

const AnalyticsRoute = () => {
  const { allReports, loading } = useOutletContext();
  if (loading) return <h2>Loading Analytics...</h2>;
  return <Analytics reports={allReports} />;
};

const AuthorityDashboardWrapper = () => (
  <Routes>
    <Route element={<AuthorityDashboardPage />}>
      <Route path="/" element={<AuthorityDashboardLayout />} >
        <Route index element={<MapFeedView />} />
      </Route>
      <Route path="analytics" element={<AnalyticsRoute />} />
      <Route path="settings" element={<SettingsPage />} />
    </Route>
  </Routes>
);

export default AuthorityDashboardWrapper;