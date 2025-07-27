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

const DashboardContentSkeleton = () => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-grow min-h-0">
    <div className="lg:col-span-2 h-full">
      <Skeleton className="h-full w-full" />
    </div>
    <div className="h-full">
      <Skeleton className="h-full w-full" />
    </div>
  </div>
);

const MapFeedView = () => {
  const {
    reports,
    loading,
    selectedReportId,
    hoveredReportId,
    setSelectedReportId,
    setHoveredReportId, // We get the setter from context
  } = useOutletContext();

  return (
    <ReportFeed
      reports={reports}
      selectedReportId={selectedReportId}
      onSelectReport={setSelectedReportId}
      onHoverReport={setHoveredReportId} // Pass the setter directly
      loading={loading}
    />
  );
};

const AuthorityDashboardLayout = () => {
  const {
    reports,
    loading,
    selectedReportId,
    hoveredReportId,
    handleMarkerClick,
    jurisdictionCenter,
    panToLocation,
    zoomToLocation, // Get the new zoom state
    handleFilterChange,
  } = useOutletContext();

  return (
    <div className="space-y-6 h-full flex flex-col min-h-0">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Jurisdiction Overview</h1>
        <p className="text-muted-foreground">Live incident feed and management tools for your area.</p>
      </div>
      
      <ReportFilters onFilterChange={handleFilterChange} />
      
      {loading ? (
        <DashboardContentSkeleton />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-grow min-h-0">
          <div className="lg:col-span-2 h-full">
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
                  zoomToLocation={zoomToLocation} // Pass the new zoom state
                />
              </CardContent>
            </Card>
          </div>
          <div className="h-full min-h-0">
            <Outlet context={useOutletContext()} />
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

  const [selectedReportId, setSelectedReportId] = useState(null);
  const [hoveredReportId, setHoveredReportId] = useState(null);
  const [jurisdictionCenter, setJurisdictionCenter] = useState(null);
  const [panToLocation, setPanToLocation] = useState(null);
  // --- THIS IS THE FIX (Part 1): Add new state for hover-zoom ---
  const [zoomToLocation, setZoomToLocation] = useState(null);

  const fetchReports = useCallback(async () => {
    if (!profile?.jurisdiction) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

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
      const channel = supabase
        .channel(`public:reports:jurisdiction=eq.${profile.jurisdiction}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'reports', filter: `jurisdiction=eq.${profile.jurisdiction}` }, () => fetchReports())
        .subscribe();
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
  
  // --- THIS IS THE FIX (Part 2): Create a new handler for hover events ---
  const handleHoverReport = useCallback((reportId) => {
    setHoveredReportId(reportId); // Keep this for highlighting the pin
    if (reportId) {
      const report = reports.find(r => r.id === reportId);
      if (report?.location) {
        // Set the zoom state with coordinates and a close-up zoom level
        setZoomToLocation({ center: report.location, zoom: 17 });
      }
    }
  }, [reports]); // Dependency on `reports` is correct here

  const handleFilterChange = useCallback((newFilters) => setFilters(newFilters), []);
  const handleMarkerClick = useCallback((reportId) => setSelectedReportId(reportId), []);
  const handleCloseQuickView = useCallback(() => setSelectedReportId(null), []);

  const filteredReports = useMemo(() => {
    return reports.filter(report => {
      // ... filter logic remains the same
      const { startDate, endDate, incidentType, status, severity } = filters;
      if (startDate && new Date(report.created_at) < new Date(startDate)) return false;
      if (endDate && new Date(report.created_at) > new Date(endDate)) return false;
      if (incidentType && incidentType !== 'all' && report.incident_type !== incidentType) return false;
      if (status && status !== 'all' && report.status !== status) return false;
      if (severity && severity !== 'all' && report.severity !== severity) return false;
      return true;
    });
  }, [reports, filters]);

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
    setHoveredReportId: handleHoverReport, // Pass the new handler
    handleFilterChange,
    handleMarkerClick,
    jurisdictionCenter,
    panToLocation,
    zoomToLocation, // Pass the new state
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