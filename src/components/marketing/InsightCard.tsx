import { motion } from "framer-motion";
import { Insight } from "@/hooks/useMarketingData";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, TrendingUp, Target, AlertCircle } from "lucide-react";
import { format } from "date-fns";

interface InsightCardProps {
  insight: Insight;
  index?: number;
}

export function InsightCard({ insight, index = 0 }: InsightCardProps) {
  const getInsightIcon = (type: string) => {
    switch (type) {
      case "trend":
        return <TrendingUp className="h-5 w-5" />;
      case "performance":
        return <Target className="h-5 w-5" />;
      case "recommendation":
        return <Lightbulb className="h-5 w-5" />;
      default:
        return <AlertCircle className="h-5 w-5" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      case "medium":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      case "low":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      default:
        return "bg-gray-500/10 text-gray-600";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "trend":
        return "text-blue-600";
      case "performance":
        return "text-green-600";
      case "recommendation":
        return "text-purple-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="transition-all duration-200 hover:shadow-[var(--shadow-card)] hover:scale-[1.02]">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className={`${getTypeColor(insight.insight_type)}`}>
                {getInsightIcon(insight.insight_type)}
              </div>
              <h3 className="font-semibold text-sm leading-tight">{insight.title}</h3>
            </div>
            <div className="flex flex-col gap-1">
              <Badge className={getPriorityColor(insight.priority)} variant="outline">
                {insight.priority}
              </Badge>
              {insight.is_ai_generated && (
                <Badge variant="secondary" className="text-xs">
                  AI ✨
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
            {insight.content}
          </p>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{format(new Date(insight.created_at), 'MMM dd, HH:mm')}</span>
            {insight.is_ai_generated && (
              <span className="flex items-center gap-1">
                Confidence: {(insight.confidence_score * 100).toFixed(0)}%
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}