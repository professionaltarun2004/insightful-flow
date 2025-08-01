-- Drop existing tables that don't fit the new schema
DROP TABLE IF EXISTS daily_metrics CASCADE;
DROP TABLE IF EXISTS feature_usage CASCADE;
DROP TABLE IF EXISTS user_behaviors CASCADE;

-- Update users table for marketing context
ALTER TABLE users DROP COLUMN IF EXISTS plan_type;
ALTER TABLE users DROP COLUMN IF EXISTS signup_source;
ALTER TABLE users ADD COLUMN IF NOT EXISTS company_name TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS industry TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_plan TEXT DEFAULT 'starter';

-- Create campaigns table
CREATE TABLE public.campaigns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  platform TEXT NOT NULL, -- 'facebook', 'instagram', 'google', 'linkedin'
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'paused', 'completed'
  budget DECIMAL(10,2) NOT NULL DEFAULT 0,
  spent DECIMAL(10,2) NOT NULL DEFAULT 0,
  impressions INTEGER NOT NULL DEFAULT 0,
  clicks INTEGER NOT NULL DEFAULT 0,
  conversions INTEGER NOT NULL DEFAULT 0,
  ctr DECIMAL(5,4) NOT NULL DEFAULT 0, -- click-through rate
  cpc DECIMAL(10,2) NOT NULL DEFAULT 0, -- cost per click
  start_date DATE NOT NULL,
  end_date DATE,
  user_id UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create insights table for AI-generated insights
CREATE TABLE public.insights (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  insight_type TEXT NOT NULL, -- 'trend', 'performance', 'recommendation'
  priority TEXT NOT NULL DEFAULT 'medium', -- 'low', 'medium', 'high'
  campaign_id UUID REFERENCES campaigns(id),
  user_id UUID REFERENCES users(id),
  is_ai_generated BOOLEAN DEFAULT true,
  confidence_score DECIMAL(3,2) DEFAULT 0.95,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create revenue table
CREATE TABLE public.revenue (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  amount DECIMAL(12,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  channel TEXT NOT NULL, -- 'facebook', 'instagram', 'google', 'linkedin', 'direct'
  geography TEXT NOT NULL DEFAULT 'US',
  campaign_id UUID REFERENCES campaigns(id),
  user_id UUID REFERENCES users(id),
  transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revenue ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for campaigns
CREATE POLICY "Allow public read access to campaigns" 
ON public.campaigns FOR SELECT USING (true);

CREATE POLICY "Users can manage their own campaigns" 
ON public.campaigns FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for insights
CREATE POLICY "Allow public read access to insights" 
ON public.insights FOR SELECT USING (true);

CREATE POLICY "Users can manage their own insights" 
ON public.insights FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for revenue
CREATE POLICY "Allow public read access to revenue" 
ON public.revenue FOR SELECT USING (true);

CREATE POLICY "Users can manage their own revenue" 
ON public.revenue FOR ALL USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_campaigns_user_id ON public.campaigns(user_id);
CREATE INDEX idx_campaigns_platform ON public.campaigns(platform);
CREATE INDEX idx_campaigns_status ON public.campaigns(status);
CREATE INDEX idx_insights_campaign_id ON public.insights(campaign_id);
CREATE INDEX idx_insights_user_id ON public.insights(user_id);
CREATE INDEX idx_revenue_campaign_id ON public.revenue(campaign_id);
CREATE INDEX idx_revenue_user_id ON public.revenue(user_id);
CREATE INDEX idx_revenue_date ON public.revenue(transaction_date);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_campaigns_updated_at
  BEFORE UPDATE ON public.campaigns
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_insights_updated_at
  BEFORE UPDATE ON public.insights
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data for demonstration
INSERT INTO public.campaigns (name, platform, status, budget, spent, impressions, clicks, conversions, ctr, cpc, start_date, end_date) VALUES
('Summer Sale 2024', 'facebook', 'active', 5000, 2500, 125000, 4500, 180, 0.036, 0.56, '2024-07-01', '2024-08-31'),
('Brand Awareness Q3', 'instagram', 'active', 3000, 1800, 89000, 3200, 95, 0.036, 0.56, '2024-07-15', '2024-09-30'),
('Product Launch', 'google', 'active', 8000, 6200, 210000, 8400, 420, 0.040, 0.74, '2024-07-01', '2024-12-31'),
('LinkedIn B2B', 'linkedin', 'paused', 2000, 1200, 45000, 1350, 67, 0.030, 0.89, '2024-06-01', '2024-08-31'),
('Retargeting Campaign', 'facebook', 'active', 1500, 890, 67000, 2010, 134, 0.030, 0.44, '2024-07-20', null);

INSERT INTO public.insights (title, content, insight_type, priority, campaign_id) VALUES
('CTR Performance Spike', 'Your Facebook campaigns show a 4% CTR improvement in the last 24 hours, particularly strong during evening hours (6-9 PM).', 'performance', 'high', (SELECT id FROM campaigns WHERE name = 'Summer Sale 2024' LIMIT 1)),
('Instagram Engagement Trend', 'Instagram campaigns are outperforming other platforms with 15% higher engagement rates this week.', 'trend', 'medium', (SELECT id FROM campaigns WHERE name = 'Brand Awareness Q3' LIMIT 1)),
('Budget Optimization Opportunity', 'Consider reallocating 20% of LinkedIn budget to Google Ads for better ROI based on current performance data.', 'recommendation', 'high', (SELECT id FROM campaigns WHERE name = 'LinkedIn B2B' LIMIT 1));

INSERT INTO public.revenue (amount, channel, geography, campaign_id, transaction_date) VALUES
(1250.50, 'facebook', 'US', (SELECT id FROM campaigns WHERE name = 'Summer Sale 2024' LIMIT 1), '2024-07-30'),
(890.25, 'instagram', 'CA', (SELECT id FROM campaigns WHERE name = 'Brand Awareness Q3' LIMIT 1), '2024-07-30'),
(2150.75, 'google', 'US', (SELECT id FROM campaigns WHERE name = 'Product Launch' LIMIT 1), '2024-07-30'),
(567.80, 'linkedin', 'UK', (SELECT id FROM campaigns WHERE name = 'LinkedIn B2B' LIMIT 1), '2024-07-29'),
(345.60, 'facebook', 'US', (SELECT id FROM campaigns WHERE name = 'Retargeting Campaign' LIMIT 1), '2024-07-30');