import React, { useState, useEffect } from 'react';
import { useSupabase } from '../../contexts/SupabaseContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

const DailyReportsChart = () => {
  const { supabase } = useSupabase();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDailyData = async () => {
      setLoading(true);
      const { data, error } = await supabase.rpc('get_daily_report_counts', {
        days_limit: 14, // Fetch data for the last 14 days
      });

      if (error) {
        console.error("Error fetching daily report stats:", error);
      } else {
        // Format the date for the chart
        const formattedData = data.map(item => ({
          ...item,
          day: new Date(item.day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        }));
        setData(formattedData);
      }
      setLoading(false);
    };

    fetchDailyData();
  }, [supabase]);

  if (loading) {
    return (
      <Card className="md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle>Reports Over Time</CardTitle>
          <CardDescription>Number of new reports submitted per day.</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[250px] w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="md:col-span-2 lg:col-span-3">
      <CardHeader>
        <CardTitle>Reports Over Time</CardTitle>
        <CardDescription>Number of new reports submitted per day over the last 14 days.</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart
            data={data}
            margin={{ top: 5, right: 20, bottom: 5, left: -10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} allowDecimals={false} />
            <Tooltip
              contentStyle={{
                background: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
              }}
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ r: 4, fill: 'hsl(var(--primary))' }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default DailyReportsChart;