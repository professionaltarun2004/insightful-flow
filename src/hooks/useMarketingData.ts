import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Campaign {
  id: string;
  name: string;
  platform: string;
  status: string;
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: number;
  cpc: number;
  start_date: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
}

export interface Insight {
  id: string;
  title: string;
  content: string;
  insight_type: string;
  priority: string;
  campaign_id?: string;
  is_ai_generated: boolean;
  confidence_score: number;
  created_at: string;
}

export interface Revenue {
  id: string;
  amount: number;
  currency: string;
  channel: string;
  geography: string;
  campaign_id?: string;
  transaction_date: string;
  created_at: string;
}

export interface MarketingData {
  campaigns: Campaign[];
  insights: Insight[];
  revenue: Revenue[];
  kpis: {
    totalSpend: number;
    totalRevenue: number;
    totalImpressions: number;
    totalClicks: number;
    totalConversions: number;
    avgCTR: number;
    avgCPC: number;
    roas: number;
  };
}

export function useMarketingData() {
  const [data, setData] = useState<MarketingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchMarketingData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch campaigns
      const { data: campaigns, error: campaignsError } = await supabase
        .from('campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (campaignsError) throw campaignsError;

      // Fetch insights
      const { data: insights, error: insightsError } = await supabase
        .from('insights')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (insightsError) throw insightsError;

      // Fetch revenue
      const { data: revenue, error: revenueError } = await supabase
        .from('revenue')
        .select('*')
        .order('transaction_date', { ascending: false });

      if (revenueError) throw revenueError;

      // Calculate KPIs
      const totalSpend = campaigns?.reduce((sum, c) => sum + Number(c.spent), 0) || 0;
      const totalRevenue = revenue?.reduce((sum, r) => sum + Number(r.amount), 0) || 0;
      const totalImpressions = campaigns?.reduce((sum, c) => sum + c.impressions, 0) || 0;
      const totalClicks = campaigns?.reduce((sum, c) => sum + c.clicks, 0) || 0;
      const totalConversions = campaigns?.reduce((sum, c) => sum + c.conversions, 0) || 0;
      const avgCTR = totalClicks > 0 ? (totalClicks / totalImpressions) * 100 : 0;
      const avgCPC = totalClicks > 0 ? totalSpend / totalClicks : 0;
      const roas = totalSpend > 0 ? totalRevenue / totalSpend : 0;

      const marketingData: MarketingData = {
        campaigns: campaigns || [],
        insights: insights || [],
        revenue: revenue || [],
        kpis: {
          totalSpend,
          totalRevenue,
          totalImpressions,
          totalClicks,
          totalConversions,
          avgCTR,
          avgCPC,
          roas,
        },
      };

      setData(marketingData);
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error loading data",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketingData();

    // Set up real-time subscriptions
    const campaignsChannel = supabase
      .channel('campaigns-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'campaigns'
        },
        () => {
          fetchMarketingData();
        }
      )
      .subscribe();

    const insightsChannel = supabase
      .channel('insights-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'insights'
        },
        () => {
          fetchMarketingData();
        }
      )
      .subscribe();

    const revenueChannel = supabase
      .channel('revenue-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'revenue'
        },
        () => {
          fetchMarketingData();
        }
      )
      .subscribe();

    // Optimized real-time updates every 30 seconds to reduce load
    const interval = setInterval(fetchMarketingData, 30000);

    return () => {
      clearInterval(interval);
      supabase.removeChannel(campaignsChannel);
      supabase.removeChannel(insightsChannel);
      supabase.removeChannel(revenueChannel);
    };
  }, []);

  return { data, loading, error, refetch: fetchMarketingData };
}