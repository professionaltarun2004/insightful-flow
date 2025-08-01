import { useState } from "react";
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
  
  const { data, loading, error } = useMarketingData();

  const handleResetFilters = () => {
    setDateRange({
      from: addDays(new Date(), -30),
      to: new Date(),
    });
    setCampaign("all");
    setPlatform("all");
  };

  if (loading) {
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

      <FilterPanel 
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        campaign={campaign}
        onCampaignChange={setCampaign}
        platform={platform}
        onPlatformChange={setPlatform}
        onReset={handleResetFilters}
      />

      {/* Live Campaign KPIs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
      >
        <MetricsCard
          title="Total Spend"
          value={`$${data?.kpis.totalSpend.toLocaleString() || "0"}`}
          change="+12% from last month"
          changeType="negative"
          icon={DollarSign}
        />
        <MetricsCard
          title="Total Revenue"
          value={`$${data?.kpis.totalRevenue.toLocaleString() || "0"}`}
          change="+18% from last month"
          changeType="positive"
          icon={TrendingUp}
        />
        <MetricsCard
          title="Average CTR"
          value={`${data?.kpis.avgCTR.toFixed(2) || 0}%`}
          change="+0.3% from last month"
          changeType="positive"
          icon={MousePointer}
        />
        <MetricsCard
          title="ROAS"
          value={`${data?.kpis.roas.toFixed(1) || 0}x`}
          change="+0.2x from last month"
          changeType="positive"
          icon={Target}
        />
      </motion.div>

      {/* Main Dashboard Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* AI Insights Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-1 space-y-4"
        >
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            AI Insights
          </h2>
          {data?.insights.slice(0, 3).map((insight, index) => (
            <InsightCard key={insight.id} insight={insight} index={index} />
          ))}
        </motion.div>

        {/* Charts Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 space-y-6"
        >
          <TrendChart 
            data={trendData} 
            title="Campaign Performance Trends"
          />
          <RevenueBreakdown revenue={data?.revenue || []} />
        </motion.div>
      </div>

      {/* Bottom Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2"
        >
          <CampaignTable campaigns={data?.campaigns || []} />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <UserTimeline />
        </motion.div>
      </div>
    </div>
  );
}