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

      // Mock data for now since we just created the tables
      const mockAnalyticsData: AnalyticsData = {
        dailyActiveUsers: 195,
        weeklyActiveUsers: 1250,
        monthlyActiveUsers: 4500,
        retentionRate: 80.9,
        totalSignups: 1365,
        churnRate: 3.2,
        featureUsage: [
          { feature: "Dashboard", usage: 1250 },
          { feature: "Reports", usage: 890 },
          { feature: "Settings", usage: 645 },
          { feature: "Analytics", usage: 523 },
          { feature: "Export", usage: 412 },
          { feature: "Integrations", usage: 356 },
          { feature: "API Access", usage: 289 },
          { feature: "Support", usage: 198 }
        ],
        trends: [
          { date: "Jan 23", signups: 15, usage: 120 },
          { date: "Jan 24", signups: 18, usage: 135 },
          { date: "Jan 25", signups: 22, usage: 142 },
          { date: "Jan 26", signups: 19, usage: 156 },
          { date: "Jan 27", signups: 25, usage: 168 },
          { date: "Jan 28", signups: 21, usage: 175 },
          { date: "Jan 29", signups: 28, usage: 182 },
          { date: "Jan 30", signups: 32, usage: 195 }
        ]
      };

      setData(mockAnalyticsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch: fetchAnalyticsData };
}