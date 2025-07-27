import React, { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { useTheme } from '@/contexts/ThemeProvider';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsiveLine } from '@nivo/line';
import { ResponsiveHeatMap } from '@nivo/heatmap';
import { ResponsivePie } from '@nivo/pie';
import { ResponsiveRadar } from '@nivo/radar';
import { formatLabel } from '../../utils/formatUtils';

// A consistent color palette for the dashboard
const COLORS = ['#4CAF50', '#2196F3', '#FFC107', '#f44336', '#9C27B0', '#FF9800', '#795548'];
const SEVERITY_COLORS = { Low: '#4CAF50', Medium: '#FFC107', High: '#FF9800', Critical: '#f44336' };

// A versatile custom tooltip for all charts
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    // Custom logic for heatmap tooltip
    if (data.day !== undefined && data.hour !== undefined) {
      return (
        <div className="p-2 text-xs bg-background/80 backdrop-blur-sm border rounded-md shadow-lg">
          <p className="font-bold">{`${data.day}, ${data.hour}:00 - ${data.hour + 1}:00`}</p>
          <p style={{ color: COLORS[0] }}>{`Incidents: ${data.count}`}</p>
        </div>
      );
    }
    return (
      <div className="p-2 text-xs bg-background/80 backdrop-blur-sm border rounded-md shadow-lg">
        <p className="font-bold">{label}</p>
        {payload.map((entry, index) => (
          <p key={`item-${index}`} style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value.toLocaleString()}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};


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
    tooltip: { container: { background: theme === 'dark' ? '#1f2937' : '#ffffff', color: 'inherit', border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}` } },
    legends: { text: { fill: theme === 'dark' ? '#d1d5db' : '#374151' } },
  };

  // =================================================================
  // DATA PROCESSING LOGIC for NIVO
  // =================================================================

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
    const dataByDate = reports.reduce((acc, report) => {
      const date = new Date(report.created_at).toISOString().split('T')[0];
      let type = report.incident_type_other || report.incident_type;
      if (!top5Types.includes(type)) {
        type = 'Other';
      }
      if (!acc[date]) {
        acc[date] = { x: date, ...top5Types.reduce((a, t) => ({ ...a, [t]: 0 }), {}), Other: 0 };
      }
      acc[date][type] = (acc[date][type] || 0) + 1;
      return acc;
    }, {});

    return [...top5Types, 'Other'].map(type => ({
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

  const statusPieData = useMemo(() => {
    if (!reports || reports.length === 0) return [];
    const statusCounts = reports.reduce((acc, report) => {
      const status = formatLabel(report.status);
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(statusCounts).map(([id, value]) => ({ id, label: id, value }));
  }, [reports]);

  const radarData = useMemo(() => {
    if (!reports || reports.length === 0) return [];
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const data = daysOfWeek.map(day => ({ day, ...top5Types.reduce((a, t) => ({ ...a, [t]: 0 }), {}) }));
    reports.forEach(report => {
      const dayIndex = new Date(report.created_at).getDay();
      let type = report.incident_type_other || report.incident_type;
      if (top5Types.includes(type)) {
        data[dayIndex][type]++;
      }
    });
    return data;
  }, [reports, top5Types]);

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Jurisdiction Analytics</h1>
        <p className="text-muted-foreground">An overview of incident patterns and trends.</p>
      </div>

      {/* --- TIER 1: HIGH-LEVEL OVERVIEW --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader><CardTitle>Report Status</CardTitle><CardDescription>Current state of all reports.</CardDescription></CardHeader>
          <CardContent className="h-[250px]">
            <ResponsivePie
              data={statusPieData}
              theme={nivoTheme}
              margin={{ top: 20, right: 80, bottom: 40, left: 80 }}
              innerRadius={0.5}
              padAngle={0.7}
              cornerRadius={3}
              activeOuterRadiusOffset={8}
              colors={{ scheme: 'set2' }}
              borderWidth={1}
              borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
              arcLinkLabelsSkipAngle={10}
              arcLinkLabelsTextColor={theme === 'dark' ? '#d1d5db' : '#374151'}
            />
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Most Common Incidents</CardTitle><CardDescription>Total count for each incident category.</CardDescription></CardHeader>
          <CardContent className="h-[250px]">
            <ResponsiveBar
              data={commonIncidentsData.slice(-7)} // Show top 7
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

      {/* --- TIER 2: TEMPORAL TRENDS --- */}
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

      {/* --- TIER 3: CATEGORICAL BREAKDOWN --- */}
      <Card>
        <CardHeader><CardTitle>Daily Incident Profile</CardTitle><CardDescription>Comparing the volume of top 5 incident types for each day of the week.</CardDescription></CardHeader>
        <CardContent className="h-[400px]">
          <ResponsiveRadar
            data={radarData}
            keys={top5Types}
            indexBy="day"
            theme={nivoTheme}
            margin={{ top: 70, right: 80, bottom: 40, left: 80 }}
            borderColor={{ from: 'color' }}
            gridLabelOffset={36}
            dotSize={10}
            dotColor={{ theme: 'background' }}
            dotBorderWidth={2}
            colors={{ scheme: 'set2' }}
            blendMode="multiply"
            motionConfig="wobbly"
            legends={[{ anchor: 'top-left', direction: 'column', translateX: -50, translateY: -40, itemWidth: 80, itemHeight: 20, symbolSize: 12, symbolShape: 'circle' }]}
          />
        </CardContent>
      </Card>
      
      {/* --- TIER 4: GRANULAR HOTSPOTS --- */}
      <Card>
        <CardHeader><CardTitle>Incident Hotspots by Time of Day</CardTitle><CardDescription>Darker squares indicate more incidents.</CardDescription></CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveHeatMap
            data={heatmapData}
            theme={nivoTheme}
            margin={{ top: 10, right: 60, bottom: 80, left: 90 }} // Increased margins
            valueFormat=">-.0s"
            axisTop={null}
            axisRight={null}
            axisBottom={{ tickSize: 5, tickPadding: 5, tickRotation: 0, legend: 'Hour of Day', legendPosition: 'middle', legendOffset: 30, format: v => `${v}:00` }}
            axisLeft={{ tickSize: 5, tickPadding: 5, tickRotation: 0, legend: 'Day of Week', legendPosition: 'middle', legendOffset: -80 }} // Increased legend offset
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