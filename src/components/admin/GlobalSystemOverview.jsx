import { useState, useEffect } from 'react';
import { supabase } from '../../config/supabase';
import Card from '../common/Card';
import GlobalSystemOverviewSkeleton from './GlobalSystemOverviewSkeleton';

const GlobalSystemOverview = () => {
  const [userStats, setUserStats] = useState([]);
  const [reportStats, setReportStats] = useState([]);
  const [topJurisdictions, setTopJurisdictions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const { data: userStatsData, error: userStatsError } = await supabase.rpc('get_user_stats');
        if (userStatsError) throw userStatsError;
        setUserStats(userStatsData);

        const { data: reportStatsData, error: reportStatsError } = await supabase.rpc('get_report_stats');
        if (reportStatsError) throw reportStatsError;
        setReportStats(reportStatsData);

        const { data: topJurisdictionsData, error: topJurisdictionsError } = await supabase.rpc('get_top_jurisdictions_by_pending_reports', { limit_count: 5 });
        if (topJurisdictionsError) throw topJurisdictionsError;
        setTopJurisdictions(topJurisdictionsData);
      } catch (error) {
        console.error('Error fetching system overview stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <GlobalSystemOverviewSkeleton />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-neutral-100">User Stats</h3>
        <ul className="text-sm text-gray-700 dark:text-neutral-300">
          {userStats.map((stat) => (
            <li key={stat.role}><span className="font-medium">{stat.role}</span>: {stat.count}</li>
          ))}
        </ul>
      </Card>
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-neutral-100">Report Stats</h3>
        <ul className="text-sm text-gray-700 dark:text-neutral-300">
          {reportStats.map((stat) => (
            <li key={stat.status}><span className="font-medium">{stat.status}</span>: {stat.count}</li>
          ))}
        </ul>
      </Card>
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-neutral-100">Top 5 Jurisdictions (Pending Reports)</h3>
        <ul className="text-sm text-gray-700 dark:text-neutral-300">
          {topJurisdictions.map((jurisdiction) => (
            <li key={jurisdiction.jurisdiction}><span className="font-medium">{jurisdiction.jurisdiction_name}</span>: {jurisdiction.pending_reports_count}</li>
          ))}
        </ul>
      </Card>
    </div>
  );
};

export default GlobalSystemOverview;