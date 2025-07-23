import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import MapView from '../map/MapView';

const Analytics = ({ reports }) => {
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
          <CardHeader>
            <CardTitle>Incident Trends Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="hsl(var(--primary))" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Most Common Incident Types</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={typeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="hsl(var(--secondary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Incident Hotspots</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-96">
              <MapView reports={reports} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;