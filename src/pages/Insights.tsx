import { InsightsPanel } from "@/components/InsightsPanel";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle } from "lucide-react";

export default function Insights() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Insights</h1>
        <p className="text-muted-foreground">AI-powered insights and recommendations</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance Insights</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">User engagement up 15%</span>
                <Badge variant="secondary">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Good
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Page load time improved</span>
                <Badge variant="secondary">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Good
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usage Patterns</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Peak usage: 2-4 PM</span>
                <Badge variant="outline">Peak</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Mobile traffic: 68%</span>
                <Badge variant="outline">Mobile</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recommendations</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Optimize mobile experience</span>
                <Badge variant="destructive">Action</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Increase retention campaigns</span>
                <Badge variant="destructive">Action</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <InsightsPanel />
    </div>
  );
}