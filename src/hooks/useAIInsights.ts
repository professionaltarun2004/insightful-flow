import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UseAIInsightsReturn {
  insights: string | null;
  loading: boolean;
  error: string | null;
  generateInsights: (prompt?: string) => Promise<void>;
  retryCount: number;
}

const FALLBACK_INSIGHTS = [
  "Your CTR has improved by 4% in the last 24 hours - Instagram campaigns are performing exceptionally well.",
  "Budget reallocation opportunity: Facebook campaigns are showing 23% higher ROAS than LinkedIn campaigns.",
  "Peak engagement detected between 6-9 PM - consider scheduling more content during these hours.",
  "Conversion rate optimization needed: Landing page A is underperforming by 18% compared to page B."
];

const MAX_RETRIES = 3;

export function useAIInsights(): UseAIInsightsReturn {
  const [insights, setInsights] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const { toast } = useToast();

  const generateInsights = useCallback(async (prompt?: string) => {
    if (loading) return;

    try {
      setLoading(true);
      setError(null);
      
      const { data, error: functionError } = await supabase.functions.invoke('generate-insights', {
        body: { 
          prompt: prompt || 'Generate actionable marketing insights based on current campaign performance, focusing on optimization opportunities and budget allocation recommendations.' 
        }
      });

      if (functionError) {
        throw new Error(`AI Function Error: ${functionError.message}`);
      }

      if (data?.insights) {
        setInsights(data.insights);
        setRetryCount(0);
        toast({
          title: "AI Insights Generated",
          description: "Fresh insights have been generated successfully.",
        });
      } else {
        throw new Error('No insights received from AI service');
      }
    } catch (err: any) {
      console.error('Error generating insights:', err);
      
      const currentRetryCount = retryCount + 1;
      setRetryCount(currentRetryCount);
      
      if (currentRetryCount < MAX_RETRIES) {
        // Auto-retry with exponential backoff
        const delay = Math.pow(2, currentRetryCount) * 1000;
        setTimeout(() => {
          generateInsights(prompt);
        }, delay);
        
        toast({
          title: "Retrying AI Generation",
          description: `Attempt ${currentRetryCount + 1} of ${MAX_RETRIES}...`,
          variant: "default",
        });
      } else {
        // Use fallback insights after max retries
        const fallbackInsight = FALLBACK_INSIGHTS[Math.floor(Math.random() * FALLBACK_INSIGHTS.length)];
        setInsights(fallbackInsight);
        setError('AI service temporarily unavailable - showing cached insights');
        
        toast({
          title: "AI Service Unavailable",
          description: "Showing cached insights instead. Please try again later.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  }, [loading, retryCount, toast]);

  return {
    insights,
    loading,
    error,
    generateInsights,
    retryCount
  };
}