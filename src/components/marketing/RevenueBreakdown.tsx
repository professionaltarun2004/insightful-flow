import { motion } from "framer-motion";
import { Revenue } from "@/hooks/useMarketingData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { DollarSign, Globe, Zap } from "lucide-react";

interface RevenueBreakdownProps {
  revenue: Revenue[];
}

export function RevenueBreakdown({ revenue }: RevenueBreakdownProps) {
  // Process data for charts
  const channelData = revenue.reduce((acc, item) => {
    const existing = acc.find(d => d.channel === item.channel);
    if (existing) {
      existing.amount += Number(item.amount);
    } else {
      acc.push({
        channel: item.channel,
        amount: Number(item.amount),
      });
    }
    return acc;
  }, [] as Array<{ channel: string; amount: number }>);

  const geographyData = revenue.reduce((acc, item) => {
    const existing = acc.find(d => d.geography === item.geography);
    if (existing) {
      existing.amount += Number(item.amount);
    } else {
      acc.push({
        geography: item.geography,
        amount: Number(item.amount),
      });
    }
    return acc;
  }, [] as Array<{ geography: string; amount: number }>);

  const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

  const getChannelIcon = (channel: string) => {
    const icons = {
      facebook: "📘",
      instagram: "📷",
      google: "🔍",
      linkedin: "💼",
      direct: "🌐"
    };
    return icons[channel as keyof typeof icons] || "📊";
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-primary">
            Amount: ${payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="transition-all duration-200 hover:shadow-[var(--shadow-card)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-primary" />
          Revenue Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="channel" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="channel" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              By Channel
            </TabsTrigger>
            <TabsTrigger value="geography" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              By Geography
            </TabsTrigger>
          </TabsList>

          <TabsContent value="channel" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
              >
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={channelData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ channel, percent }) => `${channel} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="amount"
                      >
                        {channelData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-4"
              >
                {channelData.map((item, index) => (
                  <div key={item.channel} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <span>{getChannelIcon(item.channel)}</span>
                        <span className="font-medium capitalize">{item.channel}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">${item.amount.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">
                        {((item.amount / channelData.reduce((sum, d) => sum + d.amount, 0)) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </TabsContent>

          <TabsContent value="geography" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={geographyData}>
                    <XAxis 
                      dataKey="geography" 
                      tick={{ fill: "hsl(var(--muted-foreground))" }}
                      axisLine={{ stroke: "hsl(var(--border))" }}
                    />
                    <YAxis 
                      tick={{ fill: "hsl(var(--muted-foreground))" }}
                      axisLine={{ stroke: "hsl(var(--border))" }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar 
                      dataKey="amount" 
                      fill="hsl(var(--primary))"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}