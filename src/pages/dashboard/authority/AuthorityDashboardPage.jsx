import { useState, useEffect, useMemo, useCallback } from 'react';
import { Routes, Route, Outlet, Link, useLocation, useOutletContext } from 'react-router-dom';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import MapView from '../../../components/map/MapView';
import TriageQueue from '../../../components/dashboard/TriageQueue';
import Analytics from '../../../components/dashboard/Analytics';
import { Button } from '@/components/ui/button';
import { useSupabase } from '../../../contexts/SupabaseContext';
import { useAuth } from '../../../contexts/AuthContext';
import ReportQuickView from '../../../components/dashboard/ReportQuickView';
import ReportFilters from '../../../components/dashboard/ReportFilters';
import { Card, CardContent } from '@/components/ui/card';
import MapViewSkeleton from '@/components/map/MapViewSkeleton';

const AuthorityDashboardPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [filters, setFilters] = useState({});
  const { supabase } = useSupabase();
  const { profile, loading: authLoading } = useAuth();

  const fetchReports = useCallback(async () => {
    if (!profile?.jurisdiction) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      // Fetch reports specifically for the logged-in authority's jurisdiction
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('jurisdiction', profile.jurisdiction)
        .order('created_at', { ascending: false });

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
    }
  }, [profile, fetchReports]);

  // Realtime subscription for new reports in the authority's jurisdiction
  useEffect(() => {
    if (!profile?.jurisdiction) return;

    const channel = supabase
      .channel(`public:reports:jurisdiction=eq.${profile.jurisdiction}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'reports', filter: `jurisdiction=eq.${profile.jurisdiction}` },
        (payload) => {
          console.log('Realtime change received!', payload);
          fetchReports(); // Re-fetch all reports on any change
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, profile, fetchReports]);


  const handleMarkerClick = (report) => setSelectedReport(report);
  const handleCloseQuickView = () => setSelectedReport(null);
  const handleReportUpdate = () => fetchReports();
  const handleFilterChange = (newFilters) => setFilters(newFilters);

  const filteredReports = useMemo(() => {
    return reports.filter(report => {
      const { startDate, endDate, incidentType, status, severity } = filters;
      if (startDate && new Date(report.created_at) < new Date(startDate)) return false;
      if (endDate && new Date(report.created_at) > new Date(endDate)) return false;
      if (incidentType && !report.incident_type.toLowerCase().includes(incidentType.toLowerCase())) return false;
      if (status && report.status !== status) return false;
      if (severity && report.severity !== severity) return false;
      return true;
    });
  }, [reports, filters]);
  
  if (authLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <p>Authenticating...</p>
        </div>
      </DashboardLayout>
    );
  }

  const outletContext = {
    reports: filteredReports,
    allReports: reports,
    handleMarkerClick,
    handleReportUpdate,
    handleFilterChange,
    loading,
    selectedReportId: selectedReport ? selectedReport.id : null,
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full">
        <DashboardNav />
        <div className="flex-grow mt-4">
          <Outlet context={outletContext} />
        </div>
      </div>
      <ReportQuickView 
        report={selectedReport} 
        onClose={handleCloseQuickView}
        onReportUpdate={handleReportUpdate} 
      />
    </DashboardLayout>
  );
};

const DashboardNav = () => {
  const location = useLocation();
  const getVariant = (path) => {
    const isOverview = path === '/dashboard/authority' && location.pathname === path;
    const isAnalytics = path !== '/dashboard/authority' && location.pathname.startsWith(path);
    return isOverview || isAnalytics ? 'secondary' : 'ghost';
  };

  return (
    <div className="flex-shrink-0 border-b-2 border-border mb-4">
      <nav className="flex space-x-4" aria-label="Tabs">
        <Button asChild variant={getVariant('/dashboard/authority')}><Link to="/dashboard/authority">Overview & Map</Link></Button>
        <Button asChild variant={getVariant('/dashboard/authority/analytics')}><Link to="/dashboard/authority/analytics">Analytics</Link></Button>
      </nav>
    </div>
  );
};

const Overview = () => {
  const { reports, loading, handleMarkerClick, handleReportUpdate, handleFilterChange, selectedReportId } = useOutletContext();
  const pendingReports = useMemo(() => reports.filter(r => r.status === 'pending_verification'), [reports]);

  return (
    <>
      <ReportFilters onFilterChange={handleFilterChange} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4" style={{ height: 'calc(100vh - 200px)' }}>
        <div className="lg:col-span-2 h-full">
          <Card className="h-full">
            <CardContent className="h-full p-2">
              {loading ? (
                <MapViewSkeleton />
              ) : (
                <MapView 
                  reports={reports} 
                  onMarkerClick={handleMarkerClick}
                  selectedReportId={selectedReportId} 
                />
              )}
            </CardContent>
          </Card>
        </div>
        <div className="h-full overflow-y-auto">
          <TriageQueue reports={pendingReports} onReportUpdate={handleReportUpdate} loading={loading} />
        </div>
      </div>
    </>
  );
};

const AnalyticsRoute = () => {
  const { allReports, loading } = useOutletContext();
  if (loading) return <div>Loading Analytics...</div>
  return <Analytics reports={allReports} />;
};

const AuthorityDashboardWrapper = () => (
  <Routes>
    <Route path="/" element={<AuthorityDashboardPage />}>
      <Route index element={<Overview />} />
      <Route path="analytics" element={<AnalyticsRoute />} />
    </Route>
  </Routes>
);

export default AuthorityDashboardWrapper;