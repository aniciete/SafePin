import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../config/supabase';
import { useAuth } from '../../contexts/AuthContext';
import DashboardWidgetSkeleton from './DashboardWidgetSkeleton';
import ReportFilters from './ReportFilters';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Reports In Jurisdiction component
 * Shows reports with transitions when data changes
 *
 * @returns {JSX.Element} Reports list
 */
const ReportsInJurisdiction = () => {
  const { profile } = useAuth();
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatedReportIds, setUpdatedReportIds] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const prevReportsRef = useRef([]);
  
  // Fetch reports from Supabase
  useEffect(() => {
    if (!profile) return;

    const fetchReports = async () => {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('jurisdiction', profile.jurisdiction);

      if (error) {
        setError(error);
      } else {
        // Store previous reports for comparison
        prevReportsRef.current = reports;
        
        // Find updated reports by comparing with previous data
        const updatedIds = new Set();
        if (prevReportsRef.current.length > 0) {
          data.forEach(report => {
            const prevReport = prevReportsRef.current.find(r => r.id === report.id);
            if (prevReport && prevReport.status !== report.status) {
              updatedIds.add(report.id);
            }
          });
        }
        
        setReports(data);
        setFilteredReports(data);
        setUpdatedReportIds(updatedIds);
      }
      setLoading(false);
    };

    fetchReports();
    
    // Set up real-time subscription for updates
    const subscription = supabase
      .channel('reports_channel')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'reports',
        filter: `jurisdiction=eq.${profile.jurisdiction}`
      }, payload => {
        fetchReports();
      })
      .subscribe();
      
    return () => {
      subscription.unsubscribe();
    };
  }, [profile]);
  
  // Clear highlight after animation completes
  useEffect(() => {
    if (updatedReportIds.size > 0) {
      const timer = setTimeout(() => {
        setUpdatedReportIds(new Set());
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [updatedReportIds]);
  
  // Handle search and filtering
  const handleFilterChange = (filters) => {
    setIsSearching(true);
    setFilterAnimation(true);
    
    // Store previous filtered reports for comparison
    const prevFilteredReports = [...filteredReports];
    
    // Create placeholder search results for animation
    const placeholderResults = reports.map(report => ({
      id: report.id,
      visible: false,
      matched: false
    }));
    
    setSearchResults(placeholderResults);
    
    // Apply filters after a short delay to allow for animation
    setTimeout(() => {
      let results = [...reports];
      
      // Apply each filter
      if (filters.startDate) {
        const startDate = new Date(filters.startDate);
        results = results.filter(report => new Date(report.created_at) >= startDate);
      }
      
      if (filters.endDate) {
        const endDate = new Date(filters.endDate);
        endDate.setHours(23, 59, 59, 999); // End of day
        results = results.filter(report => new Date(report.created_at) <= endDate);
      }
      
      if (filters.incidentType) {
        const searchTerm = filters.incidentType.toLowerCase();
        results = results.filter(report => 
          report.incident_type.toLowerCase().includes(searchTerm)
        );
      }
      
      if (filters.status) {
        results = results.filter(report => report.status === filters.status);
      }
      
      if (filters.severity) {
        results = results.filter(report => report.severity === filters.severity);
      }
      
      // Calculate which reports are new matches and which are removed
      const newMatches = results.filter(r => !prevFilteredReports.some(pr => pr.id === r.id));
      const removedMatches = prevFilteredReports.filter(pr => !results.some(r => r.id === pr.id));
      
      // Update search results with matches and animation properties
      const animatedResults = placeholderResults.map(item => {
        const matchedReport = results.find(r => r.id === item.id);
        const isMatch = !!matchedReport;
        const isNewMatch = newMatches.some(r => r.id === item.id);
        const isRemoved = removedMatches.some(r => r.id === item.id);
        
        return {
          ...item,
          visible: true,
          matched: isMatch,
          isNewMatch,
          isRemoved,
          // Stagger with natural randomness but prioritize new matches to appear first
          delay: isNewMatch ? Math.random() * 100 : Math.random() * 300 + 100
        };
      });
      
      setSearchResults(animatedResults);
      
      // After animation, update the actual filtered reports
      setTimeout(() => {
        // Apply a highlight effect to new matches
        if (animationsEnabled && !prefersReducedMotion) {
          const updatedReportIds = new Set(newMatches.map(r => r.id));
          setUpdatedReportIds(updatedReportIds);
          
          // Clear highlight after animation completes
          setTimeout(() => {
            setUpdatedReportIds(new Set());
          }, 3000);
        }
        
        setFilteredReports(results);
        setIsSearching(false);
        
        // Reset filter animation after a delay
        setTimeout(() => {
          setFilterAnimation(false);
        }, 500);
      }, 500);
    }, 300);
  };
  
  // Handle search input
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value) {
      setIsSearching(true);
      
      // Apply search after a short delay to allow for animation
      setTimeout(() => {
        const searchTermLower = value.toLowerCase();
        const results = reports.filter(report => 
          report.incident_type.toLowerCase().includes(searchTermLower) ||
          report.description?.toLowerCase().includes(searchTermLower) ||
          report.location?.toLowerCase().includes(searchTermLower)
        );
        
        setFilteredReports(results);
        setIsSearching(false);
      }, 300);
    } else {
      setFilteredReports(reports);
    }
  };

  if (loading) {
    return <DashboardWidgetSkeleton />;
  }

  if (error) {
    return (
      <div className="p-4 border rounded-lg bg-red-50 border-red-200 text-red-700">
        Error: {error.message}
      </div>
    );
  }
  
  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending_verification': return 'bg-yellow-100 text-yellow-800';
      case 'verified': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Format status for display
  const formatStatus = (status) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <ReportFilters
        onFilterChange={handleFilterChange}
        resultCount={filteredReports.length}
      />
      
      {/* Search input */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search reports..."
          value={searchTerm}
          onChange={handleSearch}
          className={`w-full p-2 pl-10 border rounded-md bg-surface bg-neutral-800 border-neutral-700 text-neutral-300 transition-all duration-300 ${
            isSearching ? 'border-primary shadow-sm shadow-primary/20' : ''
          }`}
        />
        {isSearching ? (
          <svg
            className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-primary animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <svg
            className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 transition-colors duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        )}
        {searchTerm && (
          <button
            type="button"
            onClick={() => {
              setSearchTerm('');
              setFilteredReports(reports);
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-300"
            aria-label="Clear search"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
      
      {/* Reports list */}
      <div className="p-4 border rounded-lg bg-surface bg-neutral-800 border-neutral-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-lg text-neutral-100">Reports in Your Jurisdiction</h3>
          
          <span className="text-sm text-neutral-400">
            {filteredReports.length} {filteredReports.length === 1 ? 'report' : 'reports'}
            {filteredReports.length !== reports.length && ` (filtered from ${reports.length})`}
          </span>
        </div>
        
        <AnimatePresence>
          {filteredReports.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-2"
            >
              {filteredReports.map((report) => {
                const isUpdated = updatedReportIds.has(report.id);
                return (
                  <motion.div
                    key={report.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex justify-between items-center p-2 rounded-md text-sm text-neutral-300 transition-all duration-500"
                  >
                    <div>
                      <div className="font-medium">{report.incident_type}</div>
                      <div className="text-xs mt-1 text-neutral-400">
                        {new Date(report.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(report.status)} transition-transform ${isUpdated ? 'scale-110' : ''}`}
                    >
                      <span
                        className={`inline-block w-2 h-2 rounded-full mr-1 ${
                          isUpdated ? 'animate-pulse' : ''
                        }`}
                        style={{
                          backgroundColor: `rgb(var(--status-${report.status === 'pending_verification' ? 'pending' :
                            report.status === 'verified' ? 'verified' : 'resolved'}))`
                        }}
                      ></span>
                      {formatStatus(report.status)}
                      {isUpdated && (
                        <span className="ml-1 opacity-70 text-[0.6rem]">
                          (updated)
                        </span>
                      )}
                    </span>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-8"
            >
              <p className="text-sm text-neutral-400">No reports found matching your criteria.</p>
              {searchTerm || filteredReports.length !== reports.length ? (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilteredReports(reports);
                  }}
                  className="mt-2 text-primary text-sm underline"
                >
                  Clear filters
                </button>
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ReportsInJurisdiction;