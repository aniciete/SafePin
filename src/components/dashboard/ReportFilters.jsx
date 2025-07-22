import React from 'react';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';

const ReportFilters = ({ onFilterChange }) => {
  const handleFilter = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const filters = Object.fromEntries(formData.entries());
    onFilterChange(filters);
  };

  return (
    <form onSubmit={handleFilter} className="p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Filters</h3>
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
            <option value="Pending">Pending</option>
            <option value="Verified">Verified</option>
            <option value="Resolved">Resolved</option>
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
      <div className="mt-4 flex justify-end">
        <Button type="submit">Apply Filters</Button>
      </div>
    </form>
  );
};

export default ReportFilters;