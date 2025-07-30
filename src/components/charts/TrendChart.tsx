import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

const chartConfig = {
  signups: {
    label: "Signups",
    color: "hsl(var(--chart-1))",
  },
  usage: {
    label: "Usage",
    color: "hsl(var(--chart-2))",
  },
};

interface TrendChartProps {
  data: Array<{
    date: string;
    signups: number;
    usage: number;
  }>;
  title: string;
}

export function TrendChart({ data, title }: TrendChartProps) {
  return (
    <Card className="transition-all duration-200 hover:shadow-[var(--shadow-card)]">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis 
                dataKey="date" 
                tick={{ fill: "hsl(var(--muted-foreground))" }}
                axisLine={{ stroke: "hsl(var(--border))" }}
              />
              <YAxis 
                tick={{ fill: "hsl(var(--muted-foreground))" }}
                axisLine={{ stroke: "hsl(var(--border))" }}
              />
              <Tooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="signups"
                stroke="var(--color-signups)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="usage"
                stroke="var(--color-usage)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}