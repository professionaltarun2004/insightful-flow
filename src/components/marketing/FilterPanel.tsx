import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DatePickerWithRange } from "@/components/ui/date-picker";
import { Filter, Calendar, RotateCcw } from "lucide-react";
import { DateRange } from "react-day-picker";
import { addDays } from "date-fns";

interface FilterPanelProps {
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
  campaign: string;
  onCampaignChange: (campaign: string) => void;
  platform: string;
  onPlatformChange: (platform: string) => void;
  onReset: () => void;
}

export function FilterPanel({
  dateRange,
  onDateRangeChange,
  campaign,
  onCampaignChange,
  platform,
  onPlatformChange,
  onReset,
}: FilterPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <Card className="transition-all duration-200 hover:shadow-[var(--shadow-card)]">
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Filter className="h-4 w-4 text-primary" />
              Filters:
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <DatePickerWithRange
                  value={dateRange}
                  onChange={onDateRangeChange}
                  placeholder="Select date range"
                />
              </div>

              <Select value={campaign} onValueChange={onCampaignChange}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="All Campaigns" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Campaigns</SelectItem>
                  <SelectItem value="summer_sale">Summer Sale 2024</SelectItem>
                  <SelectItem value="brand_awareness">Brand Awareness Q3</SelectItem>
                  <SelectItem value="product_launch">Product Launch</SelectItem>
                  <SelectItem value="linkedin_b2b">LinkedIn B2B</SelectItem>
                  <SelectItem value="retargeting">Retargeting Campaign</SelectItem>
                </SelectContent>
              </Select>

              <Select value={platform} onValueChange={onPlatformChange}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="All Platforms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Platforms</SelectItem>
                  <SelectItem value="facebook">📘 Facebook</SelectItem>
                  <SelectItem value="instagram">📷 Instagram</SelectItem>
                  <SelectItem value="google">🔍 Google</SelectItem>
                  <SelectItem value="linkedin">💼 LinkedIn</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              variant="outline" 
              size="sm" 
              onClick={onReset}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}