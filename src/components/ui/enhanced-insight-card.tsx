import { motion } from "framer-motion";
import { Insight } from "@/hooks/useMarketingData";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Lightbulb, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  AlertCircle, 
  Zap,
  DollarSign,
  Users,
  MousePointer
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface EnhancedInsightCardProps {
  insight: Insight;
  index?: number;
}

export function EnhancedInsightCard({ insight, index = 0 }: EnhancedInsightCardProps) {
  const getInsightIcon = (type: string, content: string) => {
    // Smart icon detection based on content
    if (content.toLowerCase().includes('revenue') || content.toLowerCase().includes('roas')) {
      return <DollarSign className="h-5 w-5" />;
    }
    if (content.toLowerCase().includes('ctr') || content.toLowerCase().includes('click')) {
      return <MousePointer className="h-5 w-5" />;
    }
    if (content.toLowerCase().includes('user') || content.toLowerCase().includes('engagement')) {
      return <Users className="h-5 w-5" />;
    }
    if (content.toLowerCase().includes('increase') || content.toLowerCase().includes('improve')) {
      return <TrendingUp className="h-5 w-5" />;
    }
    if (content.toLowerCase().includes('decrease') || content.toLowerCase().includes('drop')) {
      return <TrendingDown className="h-5 w-5" />;
    }

    // Fallback to type-based icons
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

  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case "high":
        return {
          bg: "bg-red-500/10 dark:bg-red-500/20",
          text: "text-red-600 dark:text-red-400",
          border: "border-red-500/20",
          glow: "shadow-[0_0_20px_hsl(0_84%_60%/0.1)]"
        };
      case "medium":
        return {
          bg: "bg-yellow-500/10 dark:bg-yellow-500/20",
          text: "text-yellow-600 dark:text-yellow-400",
          border: "border-yellow-500/20",
          glow: "shadow-[0_0_20px_hsl(47_96%_89%/0.1)]"
        };
      case "low":
        return {
          bg: "bg-green-500/10 dark:bg-green-500/20",
          text: "text-green-600 dark:text-green-400",
          border: "border-green-500/20",
          glow: "shadow-[0_0_20px_hsl(142_76%_36%/0.1)]"
        };
      default:
        return {
          bg: "bg-muted",
          text: "text-muted-foreground",
          border: "border-muted",
          glow: ""
        };
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "trend":
        return "text-chart-1";
      case "performance":
        return "text-chart-2";
      case "recommendation":
        return "text-primary";
      default:
        return "text-muted-foreground";
    }
  };

  const priorityConfig = getPriorityConfig(insight.priority);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ 
        y: -4, 
        scale: 1.02,
        transition: { type: "spring", stiffness: 300, damping: 20 }
      }}
      transition={{ 
        delay: index * 0.1,
        type: "spring", 
        stiffness: 200, 
        damping: 20 
      }}
    >
      <Card className={cn(
        "relative overflow-hidden transition-all duration-300 hover-lift group",
        "hover:shadow-elegant border-0 bg-gradient-to-br from-card to-card/50",
        priorityConfig.glow
      )}>
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <CardHeader className="pb-3 relative z-10">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <motion.div 
                className={cn("p-2 rounded-lg", getTypeColor(insight.insight_type))}
                whileHover={{ rotate: 15, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                {getInsightIcon(insight.insight_type, insight.content)}
              </motion.div>
              <h3 className="font-semibold text-sm leading-tight group-hover:text-primary transition-colors">
                {insight.title}
              </h3>
            </div>
            <div className="flex flex-col gap-1">
              <Badge 
                className={cn(
                  priorityConfig.bg, 
                  priorityConfig.text, 
                  priorityConfig.border,
                  "transition-all duration-300 hover:scale-105"
                )} 
                variant="outline"
              >
                {insight.priority}
              </Badge>
              {insight.is_ai_generated && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
                    <Zap className="h-3 w-3 mr-1" />
                    AI
                  </Badge>
                </motion.div>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0 relative z-10">
          <p className="text-sm text-muted-foreground leading-relaxed mb-4 group-hover:text-foreground/80 transition-colors">
            {insight.content}
          </p>
          
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              {format(new Date(insight.created_at), 'MMM dd, HH:mm')}
            </span>
            {insight.is_ai_generated && (
              <motion.div 
                className="flex items-center gap-1 text-primary"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span>
                  {(insight.confidence_score * 100).toFixed(0)}% confidence
                </span>
              </motion.div>
            )}
          </div>
        </CardContent>

        {/* Animated border on hover */}
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
      </Card>
    </motion.div>
  );
}