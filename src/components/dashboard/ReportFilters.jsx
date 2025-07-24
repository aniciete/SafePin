import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * Report Filters component
 * Provides filter controls and feedback when filters are applied
 *
 * @param {Object} props - Component props
 * @param {Function} props.onFilterChange - Callback when filters change
 * @param {number} props.resultCount - Number of results after filtering
 * @returns {JSX.Element} Filter form
 */
const ReportFilters = ({ onFilterChange, resultCount }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filterStatus, setFilterStatus] = useState('idle');
  const [activeFilters, setActiveFilters] = useState({});
  
  // Count active filters
  const activeFilterCount = Object.values(activeFilters).filter(Boolean).length;
  
  const handleFilter = (e) => {
    e.preventDefault();
    setFilterStatus('loading');
    
    const formData = new FormData(e.target);
    const filters = Object.fromEntries(formData.entries());
    
    // Filter out empty values
    const nonEmptyFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== '')
    );
    
    setActiveFilters(nonEmptyFilters);
    
    // Simulate a short delay for loading state
    setTimeout(() => {
      onFilterChange(filters);
      setFilterStatus('success');
      
      // Reset status after a short delay
      setTimeout(() => {
        setFilterStatus('idle');
      }, 1500);
    }, 500);
  };
  
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  
  const clearFilters = () => {
    setActiveFilters({});
    onFilterChange({});
    setFilterStatus('idle');
    
    // Reset form
    document.getElementById('filter-form').reset();
  };
  
  // Format filter values for display
  const formatFilterValue = (key, value) => {
    if (key === 'startDate' || key === 'endDate') {
      return new Date(value).toLocaleDateString();
    }
    
    if (key === 'status') {
      return value.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
    
    return value;
  };

  return (
    <div className="bg-surface rounded-lg shadow-md overflow-hidden transition-all duration-300">
      {/* Filter header with toggle */}
      <div
        className="p-4 flex justify-between items-center cursor-pointer"
        onClick={toggleExpand}
      >
        <div className="flex items-center">
          <h3 className="text-lg font-semibold">Filters</h3>
          {activeFilterCount > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-primary text-white text-xs rounded-full">
              {activeFilterCount}
            </span>
          )}
        </div>
        
        {resultCount !== undefined && (
          <div className="flex items-center mr-4">
            <span className="text-sm font-medium">
              {resultCount} {resultCount === 1 ? 'result' : 'results'}
            </span>
          </div>
        )}
        
        <button
          type="button"
          className="text-gray-500 hover:text-gray-700 focus:outline-none"
          aria-expanded={isExpanded}
          aria-label={isExpanded ? "Collapse filters" : "Expand filters"}
        >
          <motion.svg
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </motion.svg>
        </button>
      </div>
      
      {/* Active filters display */}
      <AnimatePresence>
        {activeFilterCount > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="px-4 pb-2"
          >
            <div className="flex flex-wrap gap-2">
              {Object.entries(activeFilters).map(([key, value]) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="inline-flex items-center bg-gray-100 bg-opacity-20 rounded-full px-3 py-1 text-xs"
                >
                  <span className="font-medium mr-1">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</span>
                  <span>{formatFilterValue(key, value)}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      const newFilters = { ...activeFilters };
                      delete newFilters[key];
                      setActiveFilters(newFilters);
                      
                      const form = document.getElementById('filter-form');
                      if (form) {
                        const field = form.elements[key];
                        if (field) field.value = '';
                      }
                      
                      const updatedFilters = { ...activeFilters };
                      delete updatedFilters[key];
                      onFilterChange(updatedFilters);
                    }}
                    className="ml-2 text-gray-500 hover:text-gray-700 w-4 h-4 flex items-center justify-center"
                    aria-label={`Remove ${key} filter`}
                  >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Expandable filter form */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form id="filter-form" onSubmit={handleFilter} className="p-4 pt-0 border-t">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label htmlFor="startDate">Start Date</label>
                  <Input type="date" id="startDate" name="startDate" />
                </div>
                <div>
                  <label htmlFor="endDate">End Date</label>
                  <Input type="date" id="endDate" name="endDate" />
                </div>
                <div>
                  <label htmlFor="incidentType">Incident Type</label>
                  <Input type="text" id="incidentType" name="incidentType" placeholder="e.g., Theft" />
                </div>
                <div>
                  <label htmlFor="status">Status</label>
                  <Select id="status" name="status">
                    <option value="">All</option>
                    <option value="pending_verification">Pending</option>
                    <option value="verified">Verified</option>
                    <option value="resolved">Resolved</option>
                  </Select>
                </div>
                <div>
                  <label htmlFor="severity">Severity</label>
                  <Select id="severity" name="severity">
                    <option value="">All</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </Select>
                </div>
              </div>
              
              <div className="mt-4 flex justify-between">
                {activeFilterCount > 0 && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="text-gray-500 hover:text-gray-700 text-sm underline"
                  >
                    Clear all filters
                  </button>
                )}
                <div className="ml-auto">
                  <Button
                    type="submit"
                    disabled={filterStatus === 'loading'}
                  >
                    {filterStatus === 'loading' ? 'Applying...' : 'Apply Filters'}
                  </Button>
                </div>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReportFilters;