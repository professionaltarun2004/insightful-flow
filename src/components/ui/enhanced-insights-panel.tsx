import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAIInsights } from "@/hooks/useAIInsights";
import { Loader2, Sparkles, RefreshCw, AlertTriangle, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

export function EnhancedInsightsPanel() {
  const { insights, loading, error, generateInsights, retryCount } = useAIInsights();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleGenerate = () => {
    generateInsights();
  };

  const getLoadingMessage = () => {
    if (retryCount > 0) {
      return `Retrying... (${retryCount}/3)`;
    }
    return "Generating AI insights...";
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="relative overflow-hidden hover-lift group">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <CardHeader className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2 text-lg">
                <motion.div
                  animate={{ rotate: loading ? 360 : 0 }}
                  transition={{ duration: 2, repeat: loading ? Infinity : 0, ease: "linear" }}
                >
                  <Sparkles className="h-5 w-5 text-primary" />
                </motion.div>
                AI-Powered Insights
              </CardTitle>
              <CardDescription>
                Get intelligent recommendations for your campaigns
              </CardDescription>
            </div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={handleGenerate}
                disabled={loading}
                size="sm"
                className={cn(
                  "relative overflow-hidden transition-all duration-300",
                  loading ? "animate-pulse" : "hover:shadow-elegant"
                )}
              >
                <AnimatePresence mode="wait">
                  {loading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center gap-2"
                    >
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="hidden sm:inline">
                        {getLoadingMessage()}
                      </span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="generate"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center gap-2"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Generate
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>
          </div>
        </CardHeader>

        <CardContent className="relative z-10">
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Alert variant="destructive" className="mb-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </motion.div>
            )}

            {insights ? (
              <motion.div
                key="insights"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <Alert className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
                  <Lightbulb className="h-4 w-4 text-primary" />
                  <AlertDescription className="text-sm leading-relaxed">
                    <motion.div
                      initial={{ height: 60, overflow: "hidden" }}
                      animate={{ 
                        height: isExpanded ? "auto" : 60,
                        overflow: isExpanded ? "visible" : "hidden"
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {insights}
                    </motion.div>
                    
                    {insights.length > 150 && (
                      <motion.button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="mt-2 text-primary hover:underline text-xs font-medium"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {isExpanded ? "Show less" : "Show more"}
                      </motion.button>
                    )}
                  </AlertDescription>
                </Alert>
              </motion.div>
            ) : !loading && (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="text-center py-8 text-muted-foreground"
              >
                <motion.div
                  animate={{ 
                    y: [0, -4, 0],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="mb-3"
                >
                  <Lightbulb className="h-8 w-8 mx-auto text-primary/60" />
                </motion.div>
                <p className="text-sm">
                  Click "Generate" to get AI-powered insights for your campaigns
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loading shimmer effect */}
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent -skew-x-12 animate-shimmer"
            />
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}