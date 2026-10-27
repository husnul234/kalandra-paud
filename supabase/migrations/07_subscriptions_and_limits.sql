-- ==============================================================================
-- KALANDRA: MIGRATION 07 - SUBSCRIPTIONS, TIERS & GENERATION USAGE LIMITS
-- Menambahkan skema tier langganan (Standar vs Pro) & pencatatan limit kuota generasi
-- ==============================================================================

-- 1. Tambah Kolom Langganan ke allowed_customers & user_profiles
DO $$ 
BEGIN
  -- Kolom tier langganan di allowed_customers
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'allowed_customers' AND column_name = 'subscription_tier') THEN
    ALTER TABLE public.allowed_customers ADD COLUMN subscription_tier TEXT NOT NULL DEFAULT 'pro' CHECK (subscription_tier IN ('standar', 'pro', 'free'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'allowed_customers' AND column_name = 'billing_cycle') THEN
    ALTER TABLE public.allowed_customers ADD COLUMN billing_cycle TEXT NOT NULL DEFAULT '1_tahun' CHECK (billing_cycle IN ('1_bulan', '6_bulan', '1_tahun', 'lifetime'));
  END IF;

  -- Kolom di user_profiles
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'subscription_tier') THEN
    ALTER TABLE public.user_profiles ADD COLUMN subscription_tier TEXT NOT NULL DEFAULT 'pro' CHECK (subscription_tier IN ('standar', 'pro', 'free'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'monthly_quota') THEN
    ALTER TABLE public.user_profiles ADD COLUMN monthly_quota INT NOT NULL DEFAULT 60;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'subscription_expires_at') THEN
    ALTER TABLE public.user_profiles ADD COLUMN subscription_expires_at TIMESTAMPTZ DEFAULT (now() + INTERVAL '1 year');
  END IF;
END $$;

-- 2. TABEL: generation_usage_logs (Audit Quota Pembuatan Dokumen)
CREATE TABLE IF NOT EXISTS public.generation_usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  doc_type TEXT NOT NULL DEFAULT 'rpm_utama' CHECK (doc_type IN ('rpm_utama', 'lampiran_observasi', 'ai_rekomendasi')),
  topic TEXT DEFAULT '',
  used_byok BOOLEAN NOT NULL DEFAULT true,
  model_used TEXT DEFAULT 'gemini-3.6-flash',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.generation_usage_logs ENABLE ROW LEVEL SECURITY;

-- 3. RLS POLICIES FOR generation_usage_logs
DROP POLICY IF EXISTS "Users view own generation logs" ON public.generation_usage_logs;
CREATE POLICY "Users view own generation logs" ON public.generation_usage_logs
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users insert own generation logs" ON public.generation_usage_logs;
CREATE POLICY "Users insert own generation logs" ON public.generation_usage_logs
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins full access to generation logs" ON public.generation_usage_logs;
CREATE POLICY "Admins full access to generation logs" ON public.generation_usage_logs
  FOR ALL TO authenticated
  USING (public.is_admin());

-- 4. FUNCTION & RPC: Hitung Pemakaian Kuota Bulanan Pengguna
CREATE OR REPLACE FUNCTION public.get_user_monthly_usage(target_user_id UUID)
RETURNS TABLE (
  total_used INT,
  rpm_count INT,
  lampiran_count INT,
  rekomendasi_count INT
) LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::INT as total_used,
    COUNT(CASE WHEN doc_type = 'rpm_utama' THEN 1 END)::INT as rpm_count,
    COUNT(CASE WHEN doc_type = 'lampiran_observasi' THEN 1 END)::INT as lampiran_count,
    COUNT(CASE WHEN doc_type = 'ai_rekomendasi' THEN 1 END)::INT as rekomendasi_count
  FROM public.generation_usage_logs
  WHERE user_id = target_user_id
    AND created_at >= date_trunc('month', now());
END;
$$;
