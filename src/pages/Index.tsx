import { useState } from "react";
import { Users, TrendingUp, UserCheck, AlertTriangle } from "lucide-react";
import { MetricsCard } from "@/components/MetricsCard";
import { UsageChart } from "@/components/charts/UsageChart";
import { TrendChart } from "@/components/charts/TrendChart";
import { FilterPanel } from "@/components/FilterPanel";
import { InsightsPanel } from "@/components/InsightsPanel";
import { useAnalytics } from "@/hooks/useAnalytics";

const Index = () => {
  const [dateRange, setDateRange] = useState("30d");
  const [region, setRegion] = useState("all");
  const [plan, setPlan] = useState("all");
  
  const { data: analytics, loading, error } = useAnalytics(dateRange);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-8 w-8 text-destructive mx-auto mb-4" />
          <p className="text-destructive">Error loading analytics: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor your SaaS metrics and user behavior in real-time
        </p>
      </div>

      <FilterPanel
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        region={region}
        onRegionChange={setRegion}
        plan={plan}
        onPlanChange={setPlan}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricsCard
          title="Daily Active Users"
          value={analytics?.dailyActiveUsers.toLocaleString() || "0"}
          change="+12.5% from yesterday"
          changeType="positive"
          icon={Users}
        />
        <MetricsCard
          title="Monthly Active Users"
          value={analytics?.monthlyActiveUsers.toLocaleString() || "0"}
          change="+8.2% from last month"
          changeType="positive"
          icon={TrendingUp}
        />
        <MetricsCard
          title="Retention Rate"
          value={`${analytics?.retentionRate || 0}%`}
          change="-2.1% from last week"
          changeType="negative"
          icon={UserCheck}
        />
        <MetricsCard
          title="Churn Rate"
          value={`${analytics?.churnRate || 0}%`}
          change="+1.3% from last week"
          changeType="negative"
          icon={AlertTriangle}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UsageChart data={analytics?.featureUsage || []} />
        <TrendChart 
          data={analytics?.trends || []} 
          title="Growth Trends" 
        />
      </div>

      <InsightsPanel />
    </div>
  );
};

export default Index;
