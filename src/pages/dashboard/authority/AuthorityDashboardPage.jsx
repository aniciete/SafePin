import React, { useState, useEffect, useMemo } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import MapView from '../../../components/map/MapView';
import TriageQueue from '../../../components/dashboard/TriageQueue';
import Analytics from '../../../components/dashboard/Analytics';
import { Button } from '../../../components/common/Button';
import { getReports } from '../../../services/report.service';
import ReportQuickView from '../../../components/dashboard/ReportQuickView';
import ReportFilters from '../../../components/dashboard/ReportFilters';

const AuthorityDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
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

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full">
        <div className="flex-shrink-0 border-b-2 border-gray-200 dark:border-neutral-700 mb-4">
          <nav className="flex space-x-4" aria-label="Tabs">
            <Button
              onClick={() => setActiveTab('dashboard')}
              variant="tertiary"
              className={`px-3 py-2 font-medium text-sm rounded-md ${
                activeTab === 'dashboard'
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                  : 'text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-200'
              }`}
            >
              Dashboard
            </Button>
            <Button
              onClick={() => setActiveTab('analytics')}
              variant="tertiary"
              className={`px-3 py-2 font-medium text-sm rounded-md ${
                activeTab === 'analytics'
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                  : 'text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-200'
              }`}
            >
              Analytics
            </Button>
          </nav>
        </div>

        {activeTab === 'dashboard' && (
          <>
            <ReportFilters onFilterChange={handleFilterChange} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full mt-4">
              <div className="lg:col-span-2 h-full">
                <MapView 
                  reports={filteredReports}
                  onMarkerClick={handleMarkerClick}
                />
              </div>
              <div className="h-full">
                <TriageQueue 
                  reports={filteredReports.filter(r => r.status === 'Pending')} 
                  onReportUpdate={handleReportUpdate}
                />
              </div>
            </div>
          </>
        )}
        {activeTab === 'analytics' && <Analytics reports={filteredReports} />}
      </div>
      <ReportQuickView report={selectedReport} onClose={handleCloseQuickView} />
    </DashboardLayout>
  );
};

export default AuthorityDashboardPage;