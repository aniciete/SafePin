import React, { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { useTheme } from '@/contexts/ThemeProvider';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsiveLine } from '@nivo/line';
import { ResponsiveHeatMap } from '@nivo/heatmap';
import { ResponsivePie } from '@nivo/pie';
import { ResponsiveSunburst } from '@nivo/sunburst';
import { formatLabel } from '../../utils/formatUtils';

// A consistent color palette for the dashboard
const COLORS = ['#4CAF50', '#2196F3', '#FFC107', '#f44336', '#9C27B0', '#FF9800', '#795548'];
const SEVERITY_COLORS = { Low: '#4CAF50', Medium: '#FFC107', High: '#FF9800', Critical: '#f44336' };
const STATUS_COLORS = { Pending_Verification: '#FFC107', Verified: '#2196F3', Resolved: '#4CAF50' };

const Analytics = ({ reports }) => {
  const { theme } = useTheme();

  const nivoTheme = {
    textColor: theme === 'dark' ? '#d1d5db' : '#374151',
    fontSize: 12,
    axis: {
      domain: { line: { stroke: theme === 'dark' ? '#4b5563' : '#d1d5db' } },
      ticks: { text: { fill: theme === 'dark' ? '#9ca3af' : '#6b7280' } },
      legend: { text: { fill: theme === 'dark' ? '#9ca3af' : '#6b7280', fontSize: 14 } },
    },
    grid: { line: { stroke: theme === 'dark' ? '#374151' : '#e5e7eb', strokeDasharray: '3 3' } },
    tooltip: { container: { background: theme === 'dark' ? '#1f2937' : '#ffffff', color: theme === 'dark' ? '#ffffff' : '#000000', border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}` } },
    legends: { text: { fill: theme === 'dark' ? '#d1d5db' : '#374151' } },
  };

  const { top5Types } = useMemo(() => {
    if (!reports || reports.length === 0) return { top5Types: [] };
    const typeCounts = reports.reduce((acc, report) => {
      const type = report.incident_type_other || report.incident_type;
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});
    const top5Types = Object.entries(typeCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name]) => name);
    return { top5Types };
  }, [reports]);

  const trendsByTypeData = useMemo(() => {
    if (!reports || reports.length === 0) return [];
    const types = [...top5Types, 'Other'];
    const dataByDate = reports.reduce((acc, report) => {
      const date = new Date(report.created_at).toISOString().split('T')[0];
      let type = report.incident_type_other || report.incident_type;
      if (!top5Types.includes(type)) {
        type = 'Other';
      }
      if (!acc[date]) {
        acc[date] = { x: date, ...types.reduce((a, t) => ({ ...a, [t]: 0 }), {}) };
      }
      acc[date][type] = (acc[date][type] || 0) + 1;
      return acc;
    }, {});

    return types.map(type => ({
      id: type,
      data: Object.values(dataByDate).map(d => ({ x: d.x, y: d[type] || 0 })).sort((a, b) => new Date(a.x) - new Date(b.x)),
    }));
  }, [reports, top5Types]);

  const commonIncidentsData = useMemo(() => {
    if (!reports || reports.length === 0) return [];
    const typeCounts = reports.reduce((acc, report) => {
      const type = report.incident_type_other || report.incident_type;
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(typeCounts).map(([name, count]) => ({ name, count })).sort((a, b) => a.count - b.count);
  }, [reports]);

  const severityPieData = useMemo(() => {
    if (!reports || reports.length === 0) return [];
    const severityCounts = reports.reduce((acc, report) => {
      const severity = formatLabel(report.severity || 'Low');
      acc[severity] = (acc[severity] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(severityCounts).map(([id, value]) => ({ id, label: id, value, color: SEVERITY_COLORS[id] }));
  }, [reports]);

  const statusPieData = useMemo(() => {
    if (!reports || reports.length === 0) return [];
    const statusCounts = reports.reduce((acc, report) => {
      const status = formatLabel(report.status);
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(statusCounts).map(([id, value]) => ({ id, label: id, value, color: STATUS_COLORS[id.replace(' ', '_')] }));
  }, [reports]);

  const heatmapData = useMemo(() => {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    if (!reports || reports.length === 0) {
      return daysOfWeek.map(day => ({ id: day, data: [] }));
    }
    const dataByDay = daysOfWeek.map(day => ({
      id: day,
      data: Array.from({ length: 24 }, (_, i) => ({ x: i, y: 0 })),
    }));
    reports.forEach(report => {
      const date = new Date(report.created_at);
      dataByDay[date.getDay()].data[date.getHours()].y++;
    });
    return dataByDay;
  }, [reports]);
  
  const sunburstData = useMemo(() => {
    if (!reports || reports.length === 0) return { name: 'reports', children: [] };
    const root = { name: "All Reports", color: "hsl(0, 0%, 50%)", children: [] };
    const severityMap = new Map();
    for (const report of reports) {
      const severity = formatLabel(report.severity || 'Low');
      const type = report.incident_type_other || report.incident_type;
      if (!severityMap.has(severity)) {
        severityMap.set(severity, { name: severity, color: SEVERITY_COLORS[severity], children: [] });
        root.children.push(severityMap.get(severity));
      }
      const severityNode = severityMap.get(severity);
      const typeNode = severityNode.children.find(child => child.name === type);
      if (typeNode) {
        typeNode.value++;
      } else {
        severityNode.children.push({ name: type, value: 1 });
      }
    }
    return root;
  }, [reports]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Jurisdiction Analytics</h1>
        <p className="text-muted-foreground">An overview of incident patterns and trends.</p>
      </div>

      <Card>
        <CardHeader><CardTitle>Incident Trends by Type</CardTitle><CardDescription>Volume of top 5 incident types and all others over time.</CardDescription></CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveLine
            data={trendsByTypeData}
            theme={nivoTheme}
            colors={COLORS}
            margin={{ top: 20, right: 110, bottom: 50, left: 60 }}
            xScale={{ type: 'time', format: '%Y-%m-%d', precision: 'day' }}
            xFormat="time:%b %d, %Y"
            yScale={{ type: 'linear', min: 0, max: 'auto', stacked: true }}
            axisBottom={{ format: '%b %d', tickValues: 'every 7 days', legend: 'Date', legendOffset: 36, legendPosition: 'middle' }}
            axisLeft={{ legend: 'Total Reports', legendOffset: -40, legendPosition: 'middle' }}
            enableGridX={false}
            pointSize={6}
            pointBorderWidth={2}
            pointBorderColor={{ from: 'serieColor' }}
            enableArea={true}
            areaOpacity={0.65}
            useMesh={true}
            legends={[{ anchor: 'bottom-right', direction: 'column', justify: false, translateX: 100, translateY: 0, itemsSpacing: 2, itemDirection: 'left-to-right', itemWidth: 80, itemHeight: 20, symbolSize: 12 }]}
          />
        </CardContent>
      </Card>

      {/* --- THIS IS THE FIX: Changed grid layout to be mobile-first --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader><CardTitle>Report Status</CardTitle><CardDescription>Current state of all reports.</CardDescription></CardHeader>
          {/* --- THIS IS THE FIX: Added responsive height --- */}
          <CardContent className="h-[300px] lg:h-[250px]">
            <ResponsivePie
              data={statusPieData}
              theme={nivoTheme}
              margin={{ top: 20, right: 40, bottom: 40, left: 40 }}
              innerRadius={0.5}
              padAngle={0.7}
              cornerRadius={3}
              activeOuterRadiusOffset={8}
              colors={{ scheme: 'set2' }}
              borderWidth={1}
              borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
              enableArcLinkLabels={false}
              arcLabelsSkipAngle={15}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Severity Distribution</CardTitle><CardDescription>Proportion of incident severities.</CardDescription></CardHeader>
          <CardContent className="h-[300px] lg:h-[250px]">
             <ResponsivePie
              data={severityPieData}
              theme={nivoTheme}
              margin={{ top: 20, right: 40, bottom: 40, left: 40 }}
              innerRadius={0.5}
              padAngle={0.7}
              cornerRadius={3}
              activeOuterRadiusOffset={8}
              colors={{ datum: 'data.color' }}
              borderWidth={1}
              borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
              enableArcLinkLabels={false}
              arcLabelsSkipAngle={15}
            />
          </CardContent>
        </Card>
        {/* --- THIS IS THE FIX: Make this card span 2 columns on medium screens --- */}
        <Card className="md:col-span-2 lg:col-span-1">
          <CardHeader><CardTitle>Most Common Incidents</CardTitle><CardDescription>Top reported incident types.</CardDescription></CardHeader>
          <CardContent className="h-[300px] lg:h-[250px]">
            <ResponsiveBar
              data={commonIncidentsData.slice(-5)}
              keys={['count']}
              indexBy="name"
              theme={nivoTheme}
              layout="horizontal"
              margin={{ top: 10, right: 40, bottom: 40, left: 120 }}
              padding={0.4}
              colors={({ index }) => COLORS[index % COLORS.length]}
              borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
              axisBottom={{ legend: 'Total Count', legendPosition: 'middle', legendOffset: 32 }}
              axisLeft={{ tickSize: 5, tickPadding: 5, tickRotation: 0 }}
              labelSkipWidth={12}
              enableGridY={false}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Hierarchical Breakdown</CardTitle><CardDescription>Incidents broken down by severity and type.</CardDescription></CardHeader>
        {/* --- THIS IS THE FIX: Added responsive height --- */}
        <CardContent className="h-[350px] lg:h-[400px]">
          <ResponsiveSunburst
            data={sunburstData}
            theme={nivoTheme}
            margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
            id="name"
            value="value"
            cornerRadius={2}
            borderColor={{ theme: 'background' }}
            colors={{ datum: 'data.color' }}
            childColor={{ from: 'color', modifiers: [['brighter', 0.1]] }}
            enableArcLabels={true}
            arcLabelsSkipAngle={15}
            arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 1.4]] }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Incident Hotspots by Time of Day</CardTitle><CardDescription>Darker squares indicate more incidents.</CardDescription></CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveHeatMap
            data={heatmapData}
            theme={nivoTheme}
            margin={{ top: 10, right: 60, bottom: 80, left: 90 }}
            valueFormat=">-.0s"
            axisTop={null}
            axisRight={null}
            axisBottom={{ tickSize: 5, tickPadding: 5, tickRotation: 0, legend: 'Hour of Day', legendPosition: 'middle', legendOffset: 32.5, format: v => `${v}:00` }}
            axisLeft={{ tickSize: 5, tickPadding: 5, tickRotation: 0, legend: 'Day of Week', legendPosition: 'middle', legendOffset: -80 }}
            colors={{ type: 'sequential', scheme: 'greens' }}
            emptyColor={theme === 'dark' ? '#1f2937' : '#f9fafb'}
            legends={[{ anchor: 'bottom', translateX: 0, translateY: 60, length: 400, thickness: 8, direction: 'row', tickPosition: 'after', tickSize: 3, tickSpacing: 4, tickOverlap: false, title: 'Less Frequent → More Frequent' }]}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;