import { useState } from "react";
import { Sparkles, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function InsightsPanel() {
  const [insights, setInsights] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const generateInsights = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-insights', {
        body: { 
          prompt: "Analyze the current user behavior trends and provide actionable insights for improving engagement and reducing churn." 
        }
      });

      if (error) throw error;

      setInsights(data.insights);
      toast({
        title: "Insights Generated",
        description: "AI-powered insights have been generated successfully.",
      });
    } catch (error) {
      console.error('Error generating insights:', error);
      toast({
        title: "Error",
        description: "Failed to generate insights. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="transition-all duration-200 hover:shadow-[var(--shadow-card)]">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI-Powered Insights
          </div>
          <Button 
            onClick={generateInsights} 
            disabled={loading}
            size="sm"
            variant="outline"
          >
            {loading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            {loading ? "Generating..." : "Generate"}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {insights ? (
          <Alert>
            <Sparkles className="h-4 w-4" />
            <AlertDescription className="whitespace-pre-line">
              {insights}
            </AlertDescription>
          </Alert>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Sparkles className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <p>Click "Generate" to get AI-powered insights about your analytics data.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}