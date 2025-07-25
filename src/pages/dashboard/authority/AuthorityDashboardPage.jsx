import { useState, useEffect, useMemo, useCallback } from 'react';
import { Routes, Route, Outlet, Link, useLocation, useOutletContext } from 'react-router-dom';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import MapView from '../../../components/map/MapView';
import Analytics from '../../../components/dashboard/Analytics';
import { Button } from '@/components/ui/button';
import { useSupabase } from '../../../contexts/SupabaseContext';
import { useAuth } from '../../../contexts/AuthContext';
import ReportQuickView from '../../../components/dashboard/ReportQuickView';
import ReportFilters from '../../../components/dashboard/ReportFilters';
import { Card, CardContent } from '@/components/ui/card';
import SettingsPage from '../admin/SettingsPage';
import MapViewSkeleton from '@/components/map/MapViewSkeleton';
import ReportFeed from '../../../components/dashboard/ReportFeed';

const AuthorityDashboardPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const { supabase } = useSupabase();
  const { profile, loading: authLoading } = useAuth();

  const [selectedReportId, setSelectedReportId] = useState(null);
  const [hoveredReportId, setHoveredReportId] = useState(null);
  const [jurisdictionCenter, setJurisdictionCenter] = useState(null); // State for auto-zoom

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

  // Fetch reports when profile is available
  useEffect(() => {
    if (profile) {
      fetchReports();
    }
  }, [profile, fetchReports]);

  // Fetch jurisdiction center when profile is available
  useEffect(() => {
    if (profile?.jurisdiction) {
      const fetchCenter = async () => {
        const { data, error } = await supabase.rpc('get_jurisdiction_centroid', {
          jurisdiction_code: profile.jurisdiction,
        });
        if (error) {
          console.error('Error fetching jurisdiction center:', error);
        } else {
          setJurisdictionCenter(data);
        }
      };
      fetchCenter();
    }
  }, [profile, supabase]);


  // Realtime subscription for report changes
  useEffect(() => {
    if (!profile?.jurisdiction) return;
    const channel = supabase
      .channel(`public:reports:jurisdiction=eq.${profile.jurisdiction}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reports', filter: `jurisdiction=eq.${profile.jurisdiction}` },
        () => fetchReports()
      )
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [supabase, profile, fetchReports]);

  const handleReportUpdate = () => fetchReports();
  const handleFilterChange = (newFilters) => setFilters(newFilters);

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

  const selectedReport = useMemo(() => {
    return reports.find(r => r.id === selectedReportId) || null;
  }, [reports, selectedReportId]);
  
  if (authLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">Authenticating...</div>
      </DashboardLayout>
    );
  }

  const outletContext = {
    reports: filteredReports,
    allReports: reports,
    loading,
    selectedReportId,
    hoveredReportId,
    setSelectedReportId,
    setHoveredReportId,
    handleFilterChange,
    jurisdictionCenter, // Pass center to Outlet context
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full">
        {/* The top nav bar is removed, relying on the sidebar now */}
        <div className="flex-grow">
          <Outlet context={outletContext} />
        </div>
      </div>
      <ReportQuickView 
        report={selectedReport} 
        onClose={() => setSelectedReportId(null)}
        onReportUpdate={handleReportUpdate} 
      />
    </DashboardLayout>
  );
};

const Overview = () => {
  const {
    reports,
    loading,
    selectedReportId,
    hoveredReportId,
    setSelectedReportId,
    setHoveredReportId,
    handleFilterChange,
    jurisdictionCenter,
  } = useOutletContext();

  return (
    <div className="space-y-6">
      <div>
       <h1 className="text-3xl font-bold tracking-tight text-foreground">Jurisdiction Overview</h1>
        <p className="text-muted-foreground">Live incident feed and management tools for your area.</p>
      </div>
      
      <ReportFilters onFilterChange={handleFilterChange} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" style={{ height: 'calc(100vh - 220px)' }}>
        <div className="lg:col-span-2 h-full">
          <Card className="h-full shadow-lg">
            <CardContent className="h-full p-0">
              {loading ? (
                <MapViewSkeleton />
              ) : (
                <MapView 
                  reports={reports} 
                  onMarkerClick={(report) => setSelectedReportId(report.id)}
                  selectedReportId={selectedReportId}
                  hoveredReportId={hoveredReportId}
                  initialCenter={jurisdictionCenter}
                  initialZoom={15}
                />
              )}
            </CardContent>
          </Card>
        </div>

        <div className="h-full">
          <ReportFeed
            reports={reports}
            selectedReportId={selectedReportId}
            onSelectReport={setSelectedReportId}
            onHoverReport={setHoveredReportId}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

const AnalyticsRoute = () => {
  const { allReports, loading } = useOutletContext();
  if (loading) return <div>Loading Analytics...</div>;
  return <Analytics reports={allReports} />;
};

const AuthorityDashboardWrapper = () => (
  <Routes>
    <Route path="/" element={<AuthorityDashboardPage />}>
      <Route index element={<Overview />} />
      <Route path="analytics" element={<AnalyticsRoute />} />
      <Route path="settings" element={<SettingsPage />} />
    </Route>
  </Routes>
);

export default AuthorityDashboardWrapper;