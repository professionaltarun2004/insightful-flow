import { MetricsCard } from "@/components/MetricsCard";
import { UsageChart } from "@/components/charts/UsageChart";
import { TrendChart } from "@/components/charts/TrendChart";
import { useAnalytics } from "@/hooks/useAnalytics";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, Percent, TrendingDown } from "lucide-react";

export default function Metrics() {
  const { data, loading, error } = useAnalytics();

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Metrics</h1>
          <p className="text-muted-foreground">Detailed analytics and performance metrics</p>
        </div>
        <div className="text-center">Loading metrics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Metrics</h1>
          <p className="text-muted-foreground">Detailed analytics and performance metrics</p>
        </div>
        <div className="text-center text-destructive">Error loading metrics: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Metrics</h1>
        <p className="text-muted-foreground">Detailed analytics and performance metrics</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricsCard
          title="Daily Active Users"
          value={data?.dailyActiveUsers.toString() || "0"}
          change="+12% from last week"
          changeType="positive"
          icon={Users}
        />
        <MetricsCard
          title="Monthly Active Users"
          value={data?.monthlyActiveUsers.toString() || "0"}
          change="+8% from last month"
          changeType="positive"
          icon={UserCheck}
        />
        <MetricsCard
          title="Retention Rate"
          value={`${data?.retentionRate || 0}%`}
          change="-2% from last month"
          changeType="negative"
          icon={Percent}
        />
        <MetricsCard
          title="Churn Rate"
          value={`${data?.churnRate || 0}%`}
          change="-5% from last month"
          changeType="positive"
          icon={TrendingDown}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Usage Analytics</CardTitle>
            <CardDescription>Feature usage breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <UsageChart data={data?.featureUsage || []} />
          </CardContent>
        </Card>

        <TrendChart 
          data={data?.trends || []} 
          title="Growth Trends"
        />
      </div>
    </div>
  );
}