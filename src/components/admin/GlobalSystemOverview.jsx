import { useState, useEffect, useMemo } from 'react';
import { useSupabase } from '../../contexts/SupabaseContext';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import GlobalSystemOverviewSkeleton from './GlobalSystemOverviewSkeleton';
import { useTheme } from '@/contexts/ThemeProvider';
import { ResponsiveFunnel } from '@nivo/funnel';
import { ResponsiveWaffle } from '@nivo/waffle';
import { ResponsiveBar } from '@nivo/bar';
import { formatLabel } from '../../utils/formatUtils';
import { getJurisdictionNameByCode } from '../../utils/jurisdictionUtils';

const ChartPlaceholder = ({ message }) => (
  <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
    {message}
  </div>
);

const GlobalSystemOverview = () => {
  const { supabase } = useSupabase();
  const { theme } = useTheme();

  const [reportStats, setReportStats] = useState({ data: [], loading: true });
  const [userStats, setUserStats] = useState({ data: [], loading: true });
  const [topJurisdictions, setTopJurisdictions] = useState({ data: [], loading: true });

  const nivoTheme = {
    textColor: theme === 'dark' ? '#d1d5db' : '#374151',
    fontSize: 12,
    axis: {
      domain: { line: { stroke: 'transparent' } },
      ticks: { text: { fill: theme === 'dark' ? '#9ca3af' : '#6b7280' } },
      legend: { text: { fill: theme === 'dark' ? '#9ca3af' : '#6b7280', fontSize: 14 } },
    },
    grid: { line: { stroke: theme === 'dark' ? '#374151' : '#e5e7eb', strokeDasharray: '3 3' } },
    tooltip: { container: { background: theme === 'dark' ? '#1f2937' : '#ffffff', color: 'inherit', border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}` } },
    legends: { text: { fill: theme === 'dark' ? '#d1d5db' : '#374151' } },
  };

  useEffect(() => {
    const fetchAllStats = async () => {
      try {
        const [reportRes, userRes, jurisdictionRes] = await Promise.all([
          supabase.rpc('get_report_stats'),
          supabase.rpc('get_user_stats'),
          supabase.rpc('get_top_jurisdictions_by_report_count', { limit_count: 5 })
        ]);

        setReportStats({ data: reportRes.data || [], loading: false });
        setUserStats({ data: userRes.data || [], loading: false });
        setTopJurisdictions({ data: jurisdictionRes.data || [], loading: false });

      } catch (error) {
        console.error('Error fetching system overview stats:', error);
        setReportStats(s => ({ ...s, loading: false }));
        setUserStats(s => ({ ...s, loading: false }));
        setTopJurisdictions(s => ({ ...s, loading: false }));
      }
    };
    fetchAllStats();
  }, [supabase]);

  const funnelData = useMemo(() => {
    if (reportStats.loading || !reportStats.data) return [];
    const order = ['Pending Verification', 'Verified', 'Resolved'];
    const counts = reportStats.data.reduce((acc, stat) => {
      acc[formatLabel(stat.status)] = stat.count;
      return acc;
    }, {});
    return order.map(step => ({
      id: step,
      value: counts[step] || 0,
      label: step,
    })).filter(d => d.value > 0);
  }, [reportStats]);

  const waffleData = useMemo(() => {
    if (userStats.loading || !userStats.data) return [];
    return userStats.data.map(stat => ({
      id: formatLabel(stat.role),
      label: formatLabel(stat.role),
      value: stat.count,
    }));
  }, [userStats]);
  
  const totalUsers = useMemo(() => (waffleData || []).reduce((sum, d) => sum + d.value, 0), [waffleData]);
  
  const topJurisdictionsData = useMemo(() => {
    if (topJurisdictions.loading || !topJurisdictions.data) return [];
    return topJurisdictions.data
      .map(j => ({
        jurisdiction: j.jurisdiction_name,
        count: j.count,
      }))
      .sort((a, b) => a.count - b.count);
  }, [topJurisdictions]);

  const isLoading = reportStats.loading || userStats.loading || topJurisdictions.loading;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Global System Overview</h1>
          <p className="text-muted-foreground">A global summary of system activity and health.</p>
        </div>
        <GlobalSystemOverviewSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Global System Overview</h1>
        <p className="text-muted-foreground">A global summary of system activity and health.</p>
      </div>
      
      {/* --- THIS IS THE FIX: Changed grid layout to be mobile-first --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Report Moderation Funnel</CardTitle><CardDescription>Flow of reports from submission to resolution.</CardDescription></CardHeader>
          {/* --- THIS IS THE FIX: Added responsive height --- */}
          <CardContent className="h-[350px] md:h-[300px]">
            {reportStats.loading ? <ChartPlaceholder message="Loading..." /> : funnelData.length > 1 ? (
              <ResponsiveFunnel data={funnelData} theme={nivoTheme} margin={{ top: 20, right: 20, bottom: 20, left: 20 }} colors={{ scheme: 'spectral' }} borderWidth={20} labelColor="white" beforeSeparatorLength={100} beforeSeparatorOffset={20} afterSeparatorLength={100} afterSeparatorOffset={20} />
            ) : ( <ChartPlaceholder message="Not enough data for a funnel." /> )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader><CardTitle>User Role Distribution</CardTitle><CardDescription>Breakdown of admin vs. authority accounts.</CardDescription></CardHeader>
          <CardContent className="h-[350px] md:h-[300px]">
             {userStats.loading ? <ChartPlaceholder message="Loading..." /> : (
                <ResponsiveWaffle data={waffleData} total={totalUsers} rows={18} columns={14} theme={nivoTheme} padding={4} margin={{ top: 10, right: 10, bottom: 50, left: 10 }} colors={{ scheme: 'set2' }} borderRadius={3} borderColor={{ from: 'color', modifiers: [['darker', 0.3]] }} legends={[{ anchor: 'bottom', direction: 'row', justify: false, translateX: 0, translateY: 40, itemsSpacing: 4, itemWidth: 100, itemHeight: 20, itemDirection: 'left-to-right', itemOpacity: 1, symbolSize: 20 }]} />
             )}
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader><CardTitle>Top 5 Active Jurisdictions</CardTitle><CardDescription>Total reports submitted per jurisdiction.</CardDescription></CardHeader>
        <CardContent className="h-[350px] md:h-[300px]">
          {topJurisdictions.loading ? <ChartPlaceholder message="Loading..." /> : topJurisdictionsData.length > 0 ? (
            <ResponsiveBar
                data={topJurisdictionsData}
                keys={['count']}
                indexBy="jurisdiction"
                theme={nivoTheme}
                layout="horizontal"
                margin={{ top: 10, right: 40, bottom: 50, left: 200 }}
                padding={0.4}
                valueScale={{ type: 'linear' }}
                indexScale={{ type: 'band', round: true }}
                colors={({ id, data }) => {
                  const value = data.count;
                  if (value > 100) return 'hsl(var(--destructive))';
                  if (value > 50) return 'hsl(var(--warning))';
                  return 'hsl(var(--primary))';
                }}
                borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                axisTop={null}
                axisRight={null}
                axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Total Reports',
                    legendPosition: 'middle',
                    legendOffset: 40,
                }}
                axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                }}
                enableGridY={false}
                labelSkipWidth={12}
                labelTextColor="white"
                animate={true}
            />
          ) : (
            <ChartPlaceholder message="No jurisdiction data available." />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GlobalSystemOverview;