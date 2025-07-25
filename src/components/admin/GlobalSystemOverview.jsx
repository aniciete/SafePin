import { useState, useEffect } from 'react';
import { useSupabase } from '../../contexts/SupabaseContext';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import GlobalSystemOverviewSkeleton from './GlobalSystemOverviewSkeleton';
import { getJurisdictionNameByCode } from '../../utils/jurisdictionUtils';
import { formatLabel } from '../../utils/formatUtils';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.25,
      ease: 'easeOut',
    },
  },
};

const GlobalSystemOverview = () => {
  const { supabase } = useSupabase();
  const [stats, setStats] = useState({ userStats: [], reportStats: [], topJurisdictions: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!supabase) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const [userRes, reportRes, jurisdictionRes] = await Promise.all([
          supabase.rpc('get_user_stats'),
          supabase.rpc('get_report_stats'),
          supabase.rpc('get_top_jurisdictions_by_pending_reports', { limit_count: 5 })
        ]);
        
        if (userRes.error) throw userRes.error;
        if (reportRes.error) throw reportRes.error;
        if (jurisdictionRes.error) throw jurisdictionRes.error;

        setStats({
          userStats: userRes.data || [],
          reportStats: reportRes.data || [],
          topJurisdictions: jurisdictionRes.data || [],
        });
      } catch (error) {
        console.error('Error fetching system overview stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [supabase]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard Overview</h1>
          <p className="text-muted-foreground">A global summary of system activity.</p>
        </div>
        <GlobalSystemOverviewSkeleton />
      </div>
    );
  }

  const COLORS = ['#4CAF50', '#2196F3', '#FFC107', '#f44336', '#9C27B0'];

  return (
    <div className="space-y-6">
      <div>
       <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard Overview</h1>
        <p className="text-muted-foreground">A global summary of system activity.</p>
      </div>
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* User Stats Card */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader><CardTitle>User Stats</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={stats.userStats} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="role" width={80} tickLine={false} axisLine={false} tickFormatter={formatLabel} />
                  <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} contentStyle={{ background: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }} />
                  <Bar dataKey="count" barSize={30} radius={[0, 4, 4, 0]}>
                    {stats.userStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Report Stats Card */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader><CardTitle>Report Stats</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                 <BarChart
                  data={stats.reportStats}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis type="number" hide />
                  <YAxis
                    type="category"
                    dataKey="status"
                    width={110}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={formatLabel}
                  />
                  <Tooltip
                    cursor={{ fill: 'hsl(var(--muted))' }}
                    contentStyle={{
                      background: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: 'var(--radius)',
                    }}
                    labelFormatter={formatLabel}
                  />
                  <Bar dataKey="count" barSize={25} radius={[0, 4, 4, 0]}>
                    {stats.reportStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Jurisdictions Card */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Top Jurisdictions</CardTitle>
              <CardDescription>By number of pending reports.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pt-6">
              {stats.topJurisdictions.length > 0 ? (
                stats.topJurisdictions.map((j) => (
                  <div key={j.jurisdiction} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground truncate pr-2">{getJurisdictionNameByCode(j.jurisdiction)}</span>
                    <span className="font-semibold">{j.pending_reports_count}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center pt-8">No pending reports.</p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default GlobalSystemOverview;