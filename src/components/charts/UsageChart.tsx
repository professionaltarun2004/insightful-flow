import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

const chartConfig = {
  usage: {
    label: "Usage Count",
    color: "hsl(var(--chart-1))",
  },
};

interface UsageChartProps {
  data: Array<{
    feature: string;
    usage: number;
  }>;
}

export function UsageChart({ data }: UsageChartProps) {
  return (
    <Card className="transition-all duration-200 hover:shadow-[var(--shadow-card)]">
      <CardHeader>
        <CardTitle>Feature Usage</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis 
                dataKey="feature" 
                tick={{ fill: "hsl(var(--muted-foreground))" }}
                axisLine={{ stroke: "hsl(var(--border))" }}
              />
              <YAxis 
                tick={{ fill: "hsl(var(--muted-foreground))" }}
                axisLine={{ stroke: "hsl(var(--border))" }}
              />
              <Tooltip content={<ChartTooltipContent />} />
              <Bar 
                dataKey="usage" 
                fill="var(--color-usage)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}