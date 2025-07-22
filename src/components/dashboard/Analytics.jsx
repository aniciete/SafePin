import React, { useState } from 'react';
import Card from '../common/Card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import MapView from '../map/MapView';
import { Button } from '../common/Button';

const Analytics = ({ reports }) => {
  const [showHeatmap, setShowHeatmap] = useState(false);

  const incidentTrends = reports.reduce((acc, report) => {
    const date = new Date(report.created_at).toLocaleDateString();
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const trendData = Object.keys(incidentTrends).map(date => ({
    date,
    count: incidentTrends[date],
  })).sort((a, b) => new Date(a.date) - new Date(b.date));

  const incidentTypes = reports.reduce((acc, report) => {
    acc[report.incident_type] = (acc[report.incident_type] || 0) + 1;
    return acc;
  }, {});

  const typeData = Object.keys(incidentTypes).map(type => ({
    name: type,
    count: incidentTypes[type],
  })).sort((a, b) => b.count - a.count);

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold mb-4">Incident Trends Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <h3 className="text-lg font-semibold mb-4">Most Common Incident Types</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={typeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
      <div className="mt-6">
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Incident Hotspots</h3>
            <Button onClick={() => setShowHeatmap(!showHeatmap)}>
              {showHeatmap ? 'Hide Heatmap' : 'Show Heatmap'}
            </Button>
          </div>
          <div className="h-96">
            <MapView reports={reports} showHeatmap={showHeatmap} />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;