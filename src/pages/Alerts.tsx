import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Bell, CheckCircle, Clock, X } from "lucide-react";

const alertsData = [
  {
    id: 1,
    title: "High Server Load",
    description: "CPU usage above 80% threshold",
    severity: "high",
    timestamp: "2 minutes ago",
    status: "active"
  },
  {
    id: 2,
    title: "Low User Engagement",
    description: "Daily active users dropped by 15%",
    severity: "medium",
    timestamp: "1 hour ago",
    status: "active"
  },
  {
    id: 3,
    title: "API Rate Limit Warning",
    description: "Approaching rate limit threshold",
    severity: "low",
    timestamp: "3 hours ago",
    status: "acknowledged"
  },
  {
    id: 4,
    title: "Database Backup Failed",
    description: "Scheduled backup process encountered errors",
    severity: "high",
    timestamp: "Yesterday",
    status: "resolved"
  }
];

export default function Alerts() {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "destructive";
      case "medium": return "default";
      case "low": return "secondary";
      default: return "outline";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <AlertTriangle className="h-4 w-4" />;
      case "acknowledged": return <Clock className="h-4 w-4" />;
      case "resolved": return <CheckCircle className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Alerts</h1>
          <p className="text-muted-foreground">System alerts and notifications</p>
        </div>
        <Button variant="outline">
          <Bell className="h-4 w-4 mr-2" />
          Configure Alerts
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Requires immediate attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Acknowledged</CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">Under investigation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">Successfully resolved</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Alerts</CardTitle>
          <CardDescription>Latest system alerts and notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {alertsData.map((alert) => (
              <Alert key={alert.id} className="relative">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    {getStatusIcon(alert.status)}
                    <div className="space-y-1">
                      <AlertTitle className="text-sm font-medium">
                        {alert.title}
                      </AlertTitle>
                      <AlertDescription className="text-sm text-muted-foreground">
                        {alert.description}
                      </AlertDescription>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge variant={getSeverityColor(alert.severity) as any}>
                          {alert.severity.toUpperCase()}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {alert.timestamp}
                        </span>
                      </div>
                    </div>
                  </div>
                  {alert.status === "active" && (
                    <Button variant="ghost" size="sm">
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </Alert>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}