import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface AnalyticsData {
  dailyActiveUsers: number;
  weeklyActiveUsers: number;
  monthlyActiveUsers: number;
  retentionRate: number;
  totalSignups: number;
  churnRate: number;
  featureUsage: Array<{ feature: string; usage: number }>;
  trends: Array<{ date: string; signups: number; usage: number }>;
}

export function useAnalytics(dateRange: string = "30d") {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch daily metrics
      const { data: dailyMetrics, error: dailyError } = await supabase
        .from('daily_metrics')
        .select('*')
        .order('date', { ascending: false })
        .limit(30);

      if (dailyError) throw dailyError;

      // Fetch feature usage
      const { data: featureUsage, error: featureError } = await supabase
        .from('feature_usage')
        .select('*')
        .order('usage_count', { ascending: false })
        .limit(10);

      if (featureError) throw featureError;

      // Calculate metrics
      const latestMetric = dailyMetrics?.[0];
      const weeklyData = dailyMetrics?.slice(0, 7) || [];
      const monthlyData = dailyMetrics?.slice(0, 30) || [];

      const analyticsData: AnalyticsData = {
        dailyActiveUsers: latestMetric?.active_users || 0,
        weeklyActiveUsers: weeklyData.reduce((sum, day) => sum + (day.active_users || 0), 0),
        monthlyActiveUsers: monthlyData.reduce((sum, day) => sum + (day.active_users || 0), 0),
        retentionRate: latestMetric?.retention_rate || 0,
        totalSignups: latestMetric?.total_signups || 0,
        churnRate: latestMetric?.churn_rate || 0,
        featureUsage: featureUsage?.map(f => ({
          feature: f.feature_name,
          usage: f.usage_count
        })) || [],
        trends: dailyMetrics?.slice(0, 14).reverse().map(day => ({
          date: new Date(day.date).toLocaleDateString(),
          signups: day.new_signups || 0,
          usage: day.active_users || 0
        })) || []
      };

      setData(analyticsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch: fetchAnalyticsData };
}