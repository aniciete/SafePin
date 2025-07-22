import { useState, useEffect, useMemo } from 'react';
import { Routes, Route, Outlet, Link, useLocation } from 'react-router-dom';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import MapView from '../../../components/map/MapView';
import TriageQueue from '../../../components/dashboard/TriageQueue';
import Analytics from '../../../components/dashboard/Analytics';
import { Button } from '@/components/ui/button';
import { getReports } from '../../../services/report.service';
import ReportQuickView from '../../../components/dashboard/ReportQuickView';
import ReportFilters from '../../../components/dashboard/ReportFilters';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

// Main Component to house the shared logic and state
const AuthorityDashboardPage = () => {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [filters, setFilters] = useState({});

  const fetchReports = async () => {
    try {
      const reportsData = await getReports();
      setReports(reportsData);
    } catch (error) {
      console.error("Failed to fetch reports:", error);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleMarkerClick = (report) => {
    setSelectedReport(report);
  };

  const handleCloseQuickView = () => {
    setSelectedReport(null);
  };

  const handleReportUpdate = () => {
    fetchReports();
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const filteredReports = useMemo(() => {
    // RLS should handle jurisdiction filtering on the backend.
    // This client-side filtering is for the UI filters only.
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

  // The context prop for Outlet will pass down all necessary state and handlers
  const outletContext = {
    reports: filteredReports,
    handleMarkerClick,
    handleReportUpdate,
    handleFilterChange,
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full">
        <DashboardNav />
        <div className="flex-grow mt-4">
          <Outlet context={outletContext} />
        </div>
      </div>
      <ReportQuickView report={selectedReport} onClose={handleCloseQuickView} />
    </DashboardLayout>
  );
};

// Navigation Tabs Component
const DashboardNav = () => {
  const location = useLocation();
  const getVariant = (path) => location.pathname.endsWith(path) ? 'secondary' : 'ghost';

  return (
    <div className="flex-shrink-0 border-b-2 border-border mb-4">
      <nav className="flex space-x-4" aria-label="Tabs">
        <Button asChild variant={getVariant('/authority')}>
          <Link to="/dashboard/authority">Overview</Link>
        </Button>
        <Button asChild variant={getVariant('/analytics')}>
          <Link to="/dashboard/authority/analytics">Analytics</Link>
        </Button>
      </nav>
    </div>
  );
};

// Overview Component (The main dashboard view)
const Overview = () => {
  const { reports, handleMarkerClick, handleReportUpdate, handleFilterChange } = useOutletContext();
  const pendingReports = useMemo(() => reports.filter(r => r.status === 'pending_verification'), [reports]);

  return (
    <>
      <ReportFilters onFilterChange={handleFilterChange} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full mt-4">
        <div className="lg:col-span-2 h-[60vh]">
          <Card className="h-full">
            <CardContent className="h-full p-2">
              <MapView reports={reports} onMarkerClick={handleMarkerClick} />
            </CardContent>
          </Card>
        </div>
        <div className="h-full">
          <TriageQueue reports={pendingReports} onReportUpdate={handleReportUpdate} />
        </div>
      </div>
    </>
  );
};

// Analytics Route Component
const AnalyticsRoute = () => {
  const { reports } = useOutletContext();
  return <Analytics reports={reports} />;
};

// We now use this wrapper with nested routes
const AuthorityDashboardWrapper = () => (
  <Routes>
    <Route path="/" element={<AuthorityDashboardPage />}>
      <Route index element={<Overview />} />
      <Route path="analytics" element={<AnalyticsRoute />} />
    </Route>
  </Routes>
);

// Helper hook to use the context from Outlet
import { useOutletContext } from 'react-router-dom';

export default AuthorityDashboardWrapper;