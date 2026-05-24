-- SupplyMind Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ──────────────────────────────────────────────────
-- COMPANIES
-- ──────────────────────────────────────────────────
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  industry TEXT,
  size TEXT CHECK (size IN ('1-50', '50-200', '200-500', '500+')),
  country TEXT DEFAULT 'AE',
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ──────────────────────────────────────────────────
-- PROFILES (extends Supabase auth.users)
-- ──────────────────────────────────────────────────
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  full_name TEXT,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'manager', 'viewer')),
  avatar_url TEXT,
  onboarded BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ──────────────────────────────────────────────────
-- DATA SOURCES (connectors)
-- ──────────────────────────────────────────────────
CREATE TABLE data_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('excel_upload', 'zoho_inventory', 'sap_b1', 'google_sheets', 'csv_upload')),
  name TEXT NOT NULL,
  status TEXT DEFAULT 'disconnected' CHECK (status IN ('connected', 'disconnected', 'error', 'syncing')),
  last_sync TIMESTAMPTZ,
  config JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ──────────────────────────────────────────────────
-- S&OP SCHEDULES
-- ──────────────────────────────────────────────────
CREATE TABLE sop_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  frequency TEXT DEFAULT 'weekly' CHECK (frequency IN ('weekly', 'biweekly', 'monthly')),
  day_of_week INTEGER DEFAULT 0 CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sun
  send_time TIME DEFAULT '06:00:00',
  attendee_emails TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ──────────────────────────────────────────────────
-- S&OP PACKS
-- ──────────────────────────────────────────────────
CREATE TABLE sop_packs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  schedule_id UUID REFERENCES sop_schedules(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  meeting_date DATE,
  status TEXT DEFAULT 'generating' CHECK (status IN ('generating', 'ready', 'sent', 'error')),
  pack_data JSONB DEFAULT '{}',
  ai_summary TEXT,
  key_decisions TEXT[],
  risks TEXT[],
  pdf_url TEXT,
  generated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ──────────────────────────────────────────────────
-- ACTION ITEMS
-- ──────────────────────────────────────────────────
CREATE TABLE action_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pack_id UUID REFERENCES sop_packs(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  owner TEXT,
  due_date DATE,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'done', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ──────────────────────────────────────────────────
-- GCC EVENT CALENDAR (pre-populated)
-- ──────────────────────────────────────────────────
CREATE TABLE gcc_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('ramadan', 'eid_fitr', 'eid_adha', 'dsf', 'white_friday', 'national_day', 'other')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  year INTEGER NOT NULL,
  country TEXT DEFAULT 'AE',
  typical_surge_multiplier DECIMAL(4,2) DEFAULT 1.0,
  pre_event_days INTEGER DEFAULT 14,
  notes TEXT
);

-- Seed GCC events for 2025-2027
INSERT INTO gcc_events (name, type, start_date, end_date, year, typical_surge_multiplier, pre_event_days, notes) VALUES
-- 2025
('Ramadan 2025', 'ramadan', '2025-03-01', '2025-03-30', 2025, 3.5, 21, 'Major FMCG surge. Food, dates, beverages, personal care.'),
('Eid al-Fitr 2025', 'eid_fitr', '2025-03-30', '2025-04-02', 2025, 2.5, 14, 'Gifting, clothing, sweets peak.'),
('Eid al-Adha 2025', 'eid_adha', '2025-06-06', '2025-06-09', 2025, 2.0, 14, 'Meat, hospitality, household items.'),
('Dubai Shopping Festival 2025', 'dsf', '2025-01-16', '2025-02-16', 2025, 2.8, 7, 'Electronics, fashion, F&B, experiences.'),
('White Friday UAE 2025', 'white_friday', '2025-11-28', '2025-11-30', 2025, 4.0, 7, 'Electronics, appliances, fashion peak.'),
('UAE National Day 2025', 'national_day', '2025-12-02', '2025-12-03', 2025, 1.5, 3, 'F&B, gifts, national merchandise.'),
-- 2026
('Ramadan 2026', 'ramadan', '2026-02-18', '2026-03-19', 2026, 3.5, 21, 'Major FMCG surge. Note: shifts 11 days earlier vs 2025.'),
('Eid al-Fitr 2026', 'eid_fitr', '2026-03-19', '2026-03-22', 2026, 2.5, 14, 'Gifting, clothing, sweets peak.'),
('Eid al-Adha 2026', 'eid_adha', '2026-05-27', '2026-05-30', 2026, 2.0, 14, 'Meat, hospitality, household items.'),
('Dubai Shopping Festival 2026', 'dsf', '2026-01-15', '2026-02-15', 2026, 2.8, 7, 'Electronics, fashion, F&B.'),
('White Friday UAE 2026', 'white_friday', '2026-11-27', '2026-11-29', 2026, 4.0, 7, 'Electronics, appliances, fashion.'),
('UAE National Day 2026', 'national_day', '2026-12-02', '2026-12-03', 2026, 1.5, 3, 'F&B, gifts, national merchandise.'),
-- 2027
('Ramadan 2027', 'ramadan', '2027-02-07', '2027-03-08', 2027, 3.5, 21, 'Shifts further earlier vs 2026.'),
('Eid al-Fitr 2027', 'eid_fitr', '2027-03-08', '2027-03-11', 2027, 2.5, 14, NULL),
('Eid al-Adha 2027', 'eid_adha', '2027-05-16', '2027-05-19', 2027, 2.0, 14, NULL),
('White Friday UAE 2027', 'white_friday', '2027-11-26', '2027-11-28', 2027, 4.0, 7, NULL),
('UAE National Day 2027', 'national_day', '2027-12-02', '2027-12-03', 2027, 1.5, 3, NULL);

-- ──────────────────────────────────────────────────
-- PRODUCTS / SKUs
-- ──────────────────────────────────────────────────
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  sku TEXT NOT NULL,
  name TEXT NOT NULL,
  category TEXT,
  sub_category TEXT,
  lead_time_days INTEGER DEFAULT 30,
  current_stock INTEGER DEFAULT 0,
  reorder_point INTEGER DEFAULT 0,
  unit_cost DECIMAL(10,2),
  unit_price DECIMAL(10,2),
  supplier_name TEXT,
  supplier_country TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(company_id, sku)
);

-- ──────────────────────────────────────────────────
-- SALES HISTORY
-- ──────────────────────────────────────────────────
CREATE TABLE sales_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  revenue DECIMAL(12,2),
  channel TEXT DEFAULT 'direct',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast date-range queries
CREATE INDEX idx_sales_history_date ON sales_history(company_id, date DESC);
CREATE INDEX idx_sales_history_product ON sales_history(product_id, date DESC);

-- ──────────────────────────────────────────────────
-- EVENT FORECASTS
-- ──────────────────────────────────────────────────
CREATE TABLE event_forecasts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  event_id UUID REFERENCES gcc_events(id) ON DELETE CASCADE,
  predicted_quantity INTEGER,
  confidence_lower INTEGER,
  confidence_upper INTEGER,
  recommended_order_date DATE,
  recommended_order_quantity INTEGER,
  surge_multiplier DECIMAL(4,2),
  ai_reasoning TEXT,
  risk_level TEXT DEFAULT 'medium' CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ──────────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ──────────────────────────────────────────────────
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE sop_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE sop_packs ENABLE ROW LEVEL SECURITY;
ALTER TABLE action_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_forecasts ENABLE ROW LEVEL SECURITY;

-- Helper: get user's company
CREATE OR REPLACE FUNCTION get_user_company_id()
RETURNS UUID AS $$
  SELECT company_id FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Policies: users can only see their company's data
CREATE POLICY "company_isolation" ON companies
  FOR ALL USING (id = get_user_company_id());

CREATE POLICY "profile_own" ON profiles
  FOR ALL USING (id = auth.uid());

CREATE POLICY "ds_company" ON data_sources
  FOR ALL USING (company_id = get_user_company_id());

CREATE POLICY "sop_sched_company" ON sop_schedules
  FOR ALL USING (company_id = get_user_company_id());

CREATE POLICY "sop_packs_company" ON sop_packs
  FOR ALL USING (company_id = get_user_company_id());

CREATE POLICY "action_items_company" ON action_items
  FOR ALL USING (company_id = get_user_company_id());

CREATE POLICY "products_company" ON products
  FOR ALL USING (company_id = get_user_company_id());

CREATE POLICY "sales_company" ON sales_history
  FOR ALL USING (company_id = get_user_company_id());

CREATE POLICY "forecasts_company" ON event_forecasts
  FOR ALL USING (company_id = get_user_company_id());

-- gcc_events is public (read-only)
ALTER TABLE gcc_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "gcc_events_public_read" ON gcc_events
  FOR SELECT USING (true);
