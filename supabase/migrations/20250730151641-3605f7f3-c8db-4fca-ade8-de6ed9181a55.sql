-- Create users table for analytics tracking
CREATE TABLE public.users (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email text UNIQUE,
  plan_type text DEFAULT 'free',
  region text DEFAULT 'us',
  signup_source text DEFAULT 'direct',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create user_behaviors table for tracking user actions
CREATE TABLE public.user_behaviors (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  session_time integer,
  feature_clicked text,
  page_visited text,
  timestamp timestamp with time zone DEFAULT now()
);

-- Create daily_metrics table for aggregated daily stats
CREATE TABLE public.daily_metrics (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date date NOT NULL UNIQUE,
  active_users integer DEFAULT 0,
  new_signups integer DEFAULT 0,
  retention_rate decimal(5,2) DEFAULT 0,
  total_signups integer DEFAULT 0,
  churn_rate decimal(5,2) DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

-- Create feature_usage table for tracking feature popularity
CREATE TABLE public.feature_usage (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  feature_name text NOT NULL UNIQUE,
  usage_count integer DEFAULT 0,
  last_used timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_behaviors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_usage ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (since this is analytics dashboard)
CREATE POLICY "Allow public read access to users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Allow public read access to user_behaviors" ON public.user_behaviors FOR SELECT USING (true);
CREATE POLICY "Allow public read access to daily_metrics" ON public.daily_metrics FOR SELECT USING (true);
CREATE POLICY "Allow public read access to feature_usage" ON public.feature_usage FOR SELECT USING (true);

-- Insert sample data for demonstration
INSERT INTO public.users (email, plan_type, region, signup_source) VALUES
('user1@example.com', 'free', 'us', 'organic'),
('user2@example.com', 'pro', 'eu', 'paid_ads'),
('user3@example.com', 'enterprise', 'asia', 'referral'),
('user4@example.com', 'free', 'us', 'organic'),
('user5@example.com', 'pro', 'eu', 'direct');

-- Insert sample daily metrics
INSERT INTO public.daily_metrics (date, active_users, new_signups, retention_rate, total_signups, churn_rate) VALUES
(CURRENT_DATE - INTERVAL '7 days', 120, 15, 75.5, 1200, 5.2),
(CURRENT_DATE - INTERVAL '6 days', 135, 18, 76.2, 1218, 4.8),
(CURRENT_DATE - INTERVAL '5 days', 142, 22, 77.1, 1240, 4.5),
(CURRENT_DATE - INTERVAL '4 days', 156, 19, 78.0, 1259, 4.2),
(CURRENT_DATE - INTERVAL '3 days', 168, 25, 78.8, 1284, 3.9),
(CURRENT_DATE - INTERVAL '2 days', 175, 21, 79.2, 1305, 3.8),
(CURRENT_DATE - INTERVAL '1 day', 182, 28, 80.1, 1333, 3.5),
(CURRENT_DATE, 195, 32, 80.9, 1365, 3.2);

-- Insert sample feature usage
INSERT INTO public.feature_usage (feature_name, usage_count) VALUES
('Dashboard', 1250),
('Reports', 890),
('Settings', 645),
('Analytics', 523),
('Export', 412),
('Integrations', 356),
('API Access', 289),
('Support', 198);

-- Create indexes for better performance
CREATE INDEX idx_user_behaviors_user_id ON public.user_behaviors(user_id);
CREATE INDEX idx_user_behaviors_timestamp ON public.user_behaviors(timestamp);
CREATE INDEX idx_daily_metrics_date ON public.daily_metrics(date);
CREATE INDEX idx_feature_usage_usage_count ON public.feature_usage(usage_count DESC);