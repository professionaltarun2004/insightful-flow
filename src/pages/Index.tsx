import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FilterPanel } from "@/components/marketing/FilterPanel";
import { MetricsCard } from "@/components/MetricsCard";
import { CampaignTable } from "@/components/marketing/CampaignTable";
import { RevenueBreakdown } from "@/components/marketing/RevenueBreakdown";
import { UserTimeline } from "@/components/marketing/UserTimeline";
import { TrendChart } from "@/components/charts/TrendChart";
import { EnhancedInsightCard } from "@/components/ui/enhanced-insight-card";
import { EnhancedInsightsPanel } from "@/components/ui/enhanced-insights-panel";
import { DashboardSkeleton, EmptyState } from "@/components/ui/loading-skeleton";
import { useMarketingData } from "@/hooks/useMarketingData";
import { DollarSign, Target, TrendingUp, MousePointer, Zap } from "lucide-react";
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
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-6"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-foreground">AddMyBrand Dashboard</h1>
          <p className="text-muted-foreground">Real-time marketing analytics and AI-powered insights</p>
        </motion.div>
        <EmptyState 
          title="Unable to load dashboard data"
          description={`Error: ${error}`}
          action={
            <button 
              onClick={() => window.location.reload()} 
              className="text-primary hover:underline"
            >
              Try refreshing the page
            </button>
          }
        />
      </motion.div>
    );
  }

  // Create trend data for chart
  const trendData = data?.campaigns.slice(0, 7).map((campaign, index) => ({
    date: campaign.start_date,
    signups: Math.floor(campaign.conversions * (1 + Math.random() * 0.5)),
    usage: campaign.clicks,
  })) || [];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg -z-10" />
        <div className="p-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">AddMyBrand Dashboard</h1>
          <p className="text-muted-foreground">Real-time marketing analytics and AI-powered insights</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <FilterPanel 
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          campaign={campaign}
          onCampaignChange={setCampaign}
          platform={platform}
          onPlatformChange={setPlatform}
          onReset={handleResetFilters}
        />
      </motion.div>

      {/* Live Campaign KPIs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
      >
        <AnimatePresence>
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
        </AnimatePresence>
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
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Zap className="h-5 w-5 text-primary" />
            </motion.div>
            AI Insights
          </h2>
          
          <EnhancedInsightsPanel />
          
          {data?.insights && data.insights.length > 0 ? (
            <AnimatePresence>
              {data.insights.slice(0, 3).map((insight, index) => (
                <EnhancedInsightCard key={insight.id} insight={insight} index={index} />
              ))}
            </AnimatePresence>
          ) : (
            <EmptyState 
              title="No insights available"
              description="Generate AI insights to see recommendations for your campaigns"
            />
          )}
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
    </motion.div>
  );
}