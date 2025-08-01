import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Clock, User, Activity, TrendingUp, MousePointer, Eye } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

interface UserActivity {
  id: string;
  type: "signup" | "campaign_view" | "insight_generated" | "conversion" | "click";
  title: string;
  description: string;
  timestamp: string;
  metadata?: any;
}

export function UserTimeline() {
  // Mock user activity data - in real implementation, this would come from your database
  const activities: UserActivity[] = [
    {
      id: "1",
      type: "conversion",
      title: "New Conversion",
      description: "Summer Sale 2024 campaign generated a conversion worth $89.99",
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    },
    {
      id: "2",
      type: "insight_generated",
      title: "AI Insight Generated",
      description: "New performance insight: CTR improvement detected",
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    },
    {
      id: "3",
      type: "click",
      title: "Campaign Click",
      description: "High-value click on Google Product Launch campaign",
      timestamp: new Date(Date.now() - 32 * 60 * 1000).toISOString(),
    },
    {
      id: "4",
      type: "campaign_view",
      title: "Campaign Analyzed",
      description: "Brand Awareness Q3 campaign performance reviewed",
      timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    },
    {
      id: "5",
      type: "signup",
      title: "New User Registration",
      description: "User completed signup via Instagram ad campaign",
      timestamp: new Date(Date.now() - 67 * 60 * 1000).toISOString(),
    },
    {
      id: "6",
      type: "conversion",
      title: "Conversion Milestone",
      description: "Retargeting Campaign reached 100 conversions",
      timestamp: new Date(Date.now() - 89 * 60 * 1000).toISOString(),
    },
    {
      id: "7",
      type: "insight_generated",
      title: "Budget Optimization",
      description: "AI recommended budget reallocation for LinkedIn campaign",
      timestamp: new Date(Date.now() - 112 * 60 * 1000).toISOString(),
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "signup":
        return <User className="h-4 w-4" />;
      case "campaign_view":
        return <Eye className="h-4 w-4" />;
      case "insight_generated":
        return <TrendingUp className="h-4 w-4" />;
      case "conversion":
        return <Activity className="h-4 w-4" />;
      case "click":
        return <MousePointer className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "signup":
        return "bg-blue-500";
      case "campaign_view":
        return "bg-purple-500";
      case "insight_generated":
        return "bg-yellow-500";
      case "conversion":
        return "bg-green-500";
      case "click":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };

  const getActivityBadge = (type: string) => {
    switch (type) {
      case "signup":
        return <Badge variant="secondary">User</Badge>;
      case "campaign_view":
        return <Badge variant="outline">View</Badge>;
      case "insight_generated":
        return <Badge className="bg-yellow-500/10 text-yellow-600">AI</Badge>;
      case "conversion":
        return <Badge className="bg-green-500/10 text-green-600">Conversion</Badge>;
      case "click":
        return <Badge className="bg-orange-500/10 text-orange-600">Click</Badge>;
      default:
        return <Badge variant="secondary">Activity</Badge>;
    }
  };

  return (
    <Card className="transition-all duration-200 hover:shadow-[var(--shadow-card)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          User Activity Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative flex gap-4 pb-4"
              >
                {/* Timeline line */}
                {index !== activities.length - 1 && (
                  <div className="absolute left-4 top-8 w-px h-full bg-border" />
                )}
                
                {/* Activity icon */}
                <div className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full ${getActivityColor(activity.type)} text-white`}>
                  {getActivityIcon(activity.type)}
                </div>

                {/* Activity content */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm">{activity.title}</h4>
                    {getActivityBadge(activity.type)}
                  </div>
                  
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {activity.description}
                  </p>
                  
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{formatDistanceToNow(new Date(activity.timestamp))} ago</span>
                    <span>•</span>
                    <span>{format(new Date(activity.timestamp), 'HH:mm')}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}