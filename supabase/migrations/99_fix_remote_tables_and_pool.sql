-- ==============================================================================
-- KALANDRA PAUD: FIX REMOTE TABLES & API KEY POOL MIGRATION
-- Jalankan skrip ini di SQL Editor Supabase untuk mengatasi error 404 pada:
-- 1. allowed_customers (Pengguna & Guru / Whitelist)
-- 2. demo_api_keys (Pool Kunci API Gemini Cadangan Sistem)
-- ==============================================================================

-- 1. Pastikan ekstensi pgcrypto aktif
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Helper updated_at function (jika belum ada)
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. TABEL: allowed_customers
CREATE TABLE IF NOT EXISTS public.allowed_customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL DEFAULT '',
  whatsapp TEXT DEFAULT '',
  school_name TEXT DEFAULT '',
  account_type TEXT NOT NULL DEFAULT 'annual',
  subscription_tier TEXT NOT NULL DEFAULT 'pro',
  billing_cycle TEXT NOT NULL DEFAULT '1_tahun',
  subscription_start TIMESTAMPTZ NOT NULL DEFAULT now(),
  subscription_end TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT true,
  notes TEXT DEFAULT '',
  claimed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.allowed_customers ENABLE ROW LEVEL SECURITY;

DROP TRIGGER IF EXISTS tr_allowed_customers_updated_at ON public.allowed_customers;
CREATE TRIGGER tr_allowed_customers_updated_at
  BEFORE UPDATE ON public.allowed_customers
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

DROP POLICY IF EXISTS "Admins full access to allowed_customers" ON public.allowed_customers;
CREATE POLICY "Admins full access to allowed_customers" ON public.allowed_customers
  FOR ALL TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin' AND is_active = true
    )
  );

DROP POLICY IF EXISTS "Public check allowed email" ON public.allowed_customers;
-- Disallow unrestricted public SELECT on customer records

-- 4. TABEL: demo_api_keys
CREATE TABLE IF NOT EXISTS public.demo_api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  api_key TEXT NOT NULL,
  label TEXT DEFAULT '',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.demo_api_keys ENABLE ROW LEVEL SECURITY;

DROP TRIGGER IF EXISTS tr_demo_api_keys_updated_at ON public.demo_api_keys;
CREATE TRIGGER tr_demo_api_keys_updated_at
  BEFORE UPDATE ON public.demo_api_keys
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

DROP POLICY IF EXISTS "Admins full access to demo_api_keys" ON public.demo_api_keys;
CREATE POLICY "Admins full access to demo_api_keys" ON public.demo_api_keys
  FOR ALL TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin' AND is_active = true
    )
  );

DROP POLICY IF EXISTS "Users can read active demo keys" ON public.demo_api_keys;
-- Disallow direct user SELECT on system demo keys pool

-- 5. RPC FUNCTION: get_active_system_api_keys (Safe key rotation)
CREATE OR REPLACE FUNCTION public.get_active_system_api_keys()
RETURNS TABLE (api_key TEXT) AS $$
BEGIN
  RETURN QUERY
  SELECT d.api_key
  FROM public.demo_api_keys d
  WHERE d.is_active = true
  ORDER BY d.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
