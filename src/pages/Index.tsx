import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { FilterPanel } from "@/components/marketing/FilterPanel";
import { MetricsCard } from "@/components/MetricsCard";
import { CampaignTable } from "@/components/marketing/CampaignTable";
import { InsightCard } from "@/components/marketing/InsightCard";
import { RevenueBreakdown } from "@/components/marketing/RevenueBreakdown";
import { UserTimeline } from "@/components/marketing/UserTimeline";
import { TrendChart } from "@/components/charts/TrendChart";
import { useMarketingData } from "@/hooks/useMarketingData";
import { DollarSign, Target, TrendingUp, Users, MousePointer, Eye, Zap } from "lucide-react";
import { DateRange } from "react-day-picker";
import { addDays } from "date-fns";

export default function Index() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  });
  const [campaign, setCampaign] = useState("all");
  const [platform, setPlatform] = useState("all");
  
  const { data, loading, error, refetch } = useMarketingData();
  const [refreshing, setRefreshing] = useState(false);
  const isFirstLoad = useRef(true);

  // Only show loading on first load
  if (loading && isFirstLoad.current) {
    return (
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-foreground">AddMyBrand Dashboard</h1>
          <p className="text-muted-foreground">Real-time marketing analytics and AI-powered insights</p>
        </motion.div>
        <div className="text-center">Loading marketing data...</div>
      </div>
    );
  }

  // Track first load
  if (!loading && isFirstLoad.current) {
    isFirstLoad.current = false;
  }

  const handleResetFilters = () => {
    setDateRange({
      from: addDays(new Date(), -30),
      to: new Date(),
    });
    setCampaign("all");
    setPlatform("all");
  };



  if (error) {
    return (
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-foreground">AddMyBrand Dashboard</h1>
          <p className="text-muted-foreground">Real-time marketing analytics and AI-powered insights</p>
        </motion.div>
        <div className="text-center text-destructive">Error loading analytics: {error}</div>
      </div>
    );
  }

  // Create trend data for chart
  const trendData = data?.campaigns.slice(0, 7).map((campaign, index) => ({
    date: campaign.start_date,
    signups: Math.floor(campaign.conversions * (1 + Math.random() * 0.5)),
    usage: campaign.clicks,
  })) || [];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-foreground">AddMyBrand Dashboard</h1>
        <p className="text-muted-foreground">Real-time marketing analytics and AI-powered insights</p>
      </motion.div>

      // ...existing code...
      {/* Subtle refreshing indicator */}
      {loading && !isFirstLoad.current && (
        <div className="text-center text-xs text-muted-foreground animate-pulse">Refreshing data...</div>
      )}
      <div className="flex flex-col md:flex-row gap-6">
        <FilterPanel
          dateRange={dateRange}
          setDateRange={setDateRange}
          campaign={campaign}
          setCampaign={setCampaign}
          platform={platform}
          setPlatform={setPlatform}
          onReset={handleResetFilters}
        />
        <div className="flex-1 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricsCard kpis={data?.kpis} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TrendChart data={data?.campaigns} />
            <RevenueBreakdown data={data?.revenue} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InsightCard insights={data?.insights} />
            <UserTimeline campaigns={data?.campaigns} />
          </div>
          <CampaignTable campaigns={data?.campaigns} />
        </div>
      </div>
    </div>
  );

      // ...existing code...
}